import express from "express";
import { createUser } from "../controllers/user.controller.js";
export const userRouter = express.Router();

userRouter.post("/register", createUser);
