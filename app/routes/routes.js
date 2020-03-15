import express from "express";

const router = express.Router();

const routes = dbControllers => {
  const {
    fetchUser,
    updateUser,
    deleteUser,
    createUser,
    userCount
  } = dbControllers;

  router.get("/login", (req, res) => {
    // const users = db.get("users").value();
    //
    // res.status(200).send(users);
  });

  router.get("/fetchUser", fetchUser);

  router.put("/updateUser", updateUser);

  router.delete("/deleteUser", deleteUser);

  router.post("/createUser", createUser);

  router.get("/userCount", userCount);

  return router;
};

export default routes;
