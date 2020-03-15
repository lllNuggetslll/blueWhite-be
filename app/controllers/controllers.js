import shortid from "shortid";

const controllers = db => {
  const Users = db.get("users");

  const fetchUser = (req, res) => {
    const { email, password } = req.query;
    const user = Users.find({ email, password }).value();

    res.status(200).send(user);
  };

  const updateUser = (req, res) => {
    const { email, password, ...rest } = req.body;

    Users.find({ email, password })
      .assign({ ...rest })
      .write();

    const user = Users.find({ email, password }).value();

    res.status(200).send(user);
  };

  const deleteUser = (req, res) => {
    const { id } = req.query;
    Users.remove({ id }).write();

    res.status(200).send("User deleted.");
  };

  const createUser = (req, res) => {
    const { email, password } = req.body;

    const existentUser = Users.find({ email, password }).value();

    if (existentUser) {
      res.status(409).send("User already exists.");
    } else {
      const id = shortid.generate();

      Users.push({ id, email, password }).write();

      const newUser = Users.find({ id }).value();

      res.status(200).send(newUser);
    }
  };

  const userCount = (req, res) => {
    const userCount = Users.size().value();

    res.status(200).send({ userCount });
  };

  return { fetchUser, updateUser, deleteUser, createUser, userCount };
};

export default controllers;
