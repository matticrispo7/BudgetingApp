import express from "express";
import { body } from "express-validator";
import validator from "validator";
import jwt from "jsonwebtoken";
import * as dbUser from "../database/user.js";
import * as dbToken from "../database/token.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { Password } from "../services/password.js";
import { User } from "../database/models/User.js";
import { createTokens } from "../services/createTokens.js";

const router = express.Router();

// SIGNIN
router.post(
  "/users/signin",
  [
    body("emailOrUsername")
      .exists()
      .withMessage("Username or email is required"),
    body("emailOrUsername")
      .trim()
      .escape()
      .custom((value) => {
        // Check for valid email format
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          // Check for valid username format
          if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
            throw new Error("Invalid username or email");
          }
        }
        return true;
      }),
    body("password")
      .notEmpty()
      .withMessage("You must supply a password")
      .trim()
      .escape(),
  ],
  validateRequest,
  async (req, res) => {
    const { emailOrUsername, password } = req.body;

    const isEmail = validator.isEmail(emailOrUsername);
    let existingUser;
    if (isEmail) {
      existingUser = await dbUser.getUserByMail(emailOrUsername);
    } else {
      existingUser = await dbUser.getUserByUsername(emailOrUsername);
    }

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // check the password provided with the hashed stored in the DB
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { jwtAccessToken, jwtRefreshToken } = await createTokens(
      existingUser.id,
      existingUser.email
    );

    if (!jwtAccessToken && !jwtRefreshToken) {
      console.log("Error with tokens");
      return res.status(500).json({ error: "Unable to create tokens" });
    }

    res.status(200).json({
      id: existingUser.id,
      username: existingUser.username,
      balance: existingUser.balance,
      token: jwtAccessToken,
      refreshToken: jwtRefreshToken,
    });
  }
);

/* to validate the body, pass an array as middleware where you define the body's field to be validated*/
router.post(
  "/users/signup",
  [
    body("email")
      .exists()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),
    body("username")
      .exists()
      .withMessage("Username is required")
      .isLength({ min: 4 })
      .withMessage("Minimum length: 4"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req, res) => {
    // data are validated
    const { username, email, password } = req.body;
    // check if this email is already registered
    let existingUser = await dbUser.getUserByMail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // check if this username is already registered
    existingUser = await dbUser.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already in use" });
    }

    // create new User and save it
    const passwordHashed = await Password.toHash(password);
    const user = new User(
      username,
      email,
      passwordHashed,
      req.body?.balance
    ).toDto();
    let result = await dbUser.createUser(user);

    if (result[0].id) {
      //generate the JWT (with id|email inside its payload). The 2 param is the "signingKey"
      // (got from ENV VAR) which is used to verify if the JWT is valid or corrupted
      const { jwtAccessToken, jwtRefreshToken } = await createTokens(
        result[0].id,
        email
      );
      if (!jwtAccessToken && !jwtRefreshToken) {
        return res.status(500).send("Unable to create token");
      }
      console.log("Creating user ...");
      res.status(201).json({
        id: result[0].id,
        username: user.username,
        balance: user.balance,
        token: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      });
    } else {
      return res.status(500).send("Unable to create the user");
    }
  }
);

router.post("/users/signout", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(401).send("No refreshToken provided");
  }

  // find and delete the refresh token
  const deleteToken = await dbToken.deleteToken(refreshToken);
  if (!deleteToken) {
    res.status(500).send("Unable to delete token");
  }
  console.log("Signout user ");
  res.status(200).send("Signout ok");
});

router.post("/token", async (req, res) => {
  /* Get the new access token from the refresh token provided */
  const { id, email, token } = req.body;
  const { ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } =
    process.env;

  if (!token) {
    return res.status(401).send("No token provided");
  }

  const tokenExist = await dbToken.getTokenByUserId(id);
  if (!tokenExist) {
    return res.status(401).send("No refresh token found for user");
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err) => {
    if (err) {
      return res.sendStatus(401);
    }

    const jwtAccessToken = jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    res.json({
      token: jwtAccessToken,
    });
  });
});

export { router as authRouter };
