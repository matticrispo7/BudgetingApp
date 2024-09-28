import jwt from "jsonwebtoken";
import { Token } from "../database/models/Token.js";
import * as dbToken from "../database/token.js";
import dotenv from "dotenv";

export const createTokens = async (id, email) => {
  let ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET;
  if (process.env.NODE_ENV === "test") {
    dotenv.config();
  }
  ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE;
  ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  const jwtAccessToken = jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

  const jwtRefreshToken = jwt.sign({ id, email }, REFRESH_TOKEN_SECRET);

  // check if a refresh token already exists for this user. If so, delete it and save the new one
  // Otherwise save directly the new one
  const existingToken = await dbToken.getTokenByUserId(id);
  if (existingToken) {
    let result = await dbToken.deleteTokenByUserId(id);
    if (!result) {
      return null;
    }
  }

  const token = new Token(id, jwtRefreshToken).toDTO();
  let result = await dbToken.createToken(token);
  if (!result) {
    return null;
  }

  return { jwtAccessToken, jwtRefreshToken };
};
