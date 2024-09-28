import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //console.log("[ValidateRequest] Error while validating req: ", errors);
    return res.status(400).send();
  }

  next();
};
