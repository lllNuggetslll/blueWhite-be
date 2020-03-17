import shortid from "shortid";
import {
  generateHash,
  validatePassword,
  toAuthJSON,
  generateJWT
} from "./../auth/auth.js";

import passport from "passport";

const newUserTemplate = {
  balance: "",
  picture: "",
  age: "",
  eyeColor: "",
  name: {
    first: "",
    last: ""
  },
  company: "",
  phone: "",
  address: ""
};

const controllers = db => {
  const Users = db.get("users");

  const loginUser = (req, res, next) => {
    const { email, password } = req.body;
    const existingUser = Users.find({ email }).value();

    if (!existingUser)
      return res.status(400).send({ error: "User does not exist." });

    const { id, salt, password: hashedPassword } = existingUser;
    const verifiedPassword = validatePassword(password, salt, hashedPassword);

    if (!verifiedPassword)
      return res.status(400).send({ error: "Incorrect password." });

    return passport.authenticate("local", (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = generateJWT(id, email);

        return res.json({ user: toAuthJSON(id, email) });
      }

      return status(400).info;
    })(req, res, next);
  };

  const fetchUser = (req, res) => {
    const { id } = req.query;
    const { salt, password, ...user } = Users.find({ id }).value();

    res.status(200).send({ ...user });
  };

  const updateUser = (req, res) => {
    const { id, userData } = req.body;
    console.log("userData", userData);
    Users.find({ id })
      .assign({ ...userData })
      .write();

    const { salt, password, token, ...rest } = Users.find({
      id
    }).value();

    res.status(200).send({ ...rest });
  };

  const deleteUser = (req, res) => {
    const { id } = req.query;
    Users.remove({ id }).write();

    res.status(200).send("User deleted.");
  };

  const createUser = (req, res) => {
    const { email, password } = req.body;
    const { salt, hash } = generateHash(password);
    const existentUser = Users.find({ email }).value();

    if (existentUser) {
      res.status(409).send("User already exists.");
    } else {
      const id = shortid.generate();

      Users.push({
        ...newUserTemplate,
        id,
        email,
        salt,
        password: hash
      }).write();

      const newUser = toAuthJSON(id, email);

      res.status(200).json(newUser);
    }
  };

  const getUserCount = (req, res) => {
    const userCount = Users.size().value();

    res.status(200).send({ userCount });
  };

  return {
    loginUser,
    fetchUser,
    updateUser,
    deleteUser,
    createUser,
    getUserCount
  };
};

export default controllers;
