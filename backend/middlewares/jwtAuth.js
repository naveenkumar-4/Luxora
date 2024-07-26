import { UserSchema } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authJwt = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        const user = await UserSchema.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (err) {
      next(new Error("You are unauthorized. Please Try to login again"));
    }
  } else {
    next(new Error("There is no token provided or attached to the header"));
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  const { email } = req.user;
  const adminUser = await UserSchema.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});
