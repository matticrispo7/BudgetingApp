import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const { ACCESS_TOKEN_SECRET } = process.env;

  if (!authHeader) {
    return res.status(401).send();
    //.json({ success: false, message: "Authorization token not found" });
  }

  const token = authHeader.split(" ")[1];

  // verify the token
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();
  });
};
