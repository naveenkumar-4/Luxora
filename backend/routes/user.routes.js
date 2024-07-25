import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
} from "../controllers/user.controller.js";
export const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-all-Users", getAllUsers);
userRouter.get('/:id', getSingleUser)
