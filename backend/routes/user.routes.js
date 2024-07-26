import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
export const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-all-Users", getAllUsers);
userRouter.get("/:id", authJwt, isAdmin, getSingleUser);
userRouter.delete("/:id", deleteUser);
userRouter.put("/update-user", authJwt, updateUser);
