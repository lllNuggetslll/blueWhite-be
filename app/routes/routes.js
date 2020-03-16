import express from "express";
import { auth } from "./../auth/auth.js";

const router = express.Router();

const routes = dbControllers => {
  const {
    loginUser,
    fetchUser,
    updateUser,
    deleteUser,
    createUser,
    userCount
  } = dbControllers;

  router.post("/login", auth.optional, loginUser);

  router.get("/fetchUser", auth.required, fetchUser);

  router.put("/updateUser", auth.required, updateUser);

  router.delete("/deleteUser", auth.required, deleteUser);

  router.post("/createUser", auth.optional, createUser);

  router.get("/userCount", userCount);

  return router;
};

export default routes;
