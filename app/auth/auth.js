import crypto from "crypto";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";

export const generateHash = pw => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(pw, salt, 10000, 512, "sha1").toString("hex");

  return {
    salt,
    hash
  };
};

export const validatePassword = (pw, salt, hash) => {
  const hashToVerify = crypto
    .pbkdf2Sync(pw, salt, 10000, 512, "sha1")
    .toString("hex");

  return hash === hashToVerify;
};

export const generateJWT = (id, email) => {
  const today = new Date();
  const expirationDate = new Date(today);

  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id,
      email,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    "lemon"
  );
};

export const toAuthJSON = (id, email) => {
  return {
    id,
    email,
    token: generateJWT(id, email)
  };
};

const getTokenFromHeaders = req => {
  const {
    headers: { authorization }
  } = req;
  console.log(authorization);
  if (authorization && authorization.split(" "[0]) === "Token") {
    return authorization.split(" ")[1];
  }

  return null;
};

export const auth = {
  required: expressJwt({
    secret: "lemon",
    userProperty: "payload",
    getToken: getTokenFromHeaders
  }),
  optional: expressJwt({
    secret: "lemon",
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
};
