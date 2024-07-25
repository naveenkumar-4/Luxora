import asyncHandler from "express-async-handler";
import { UserSchema } from "../models/user.model.js";
import generateToken from "../config/jwtAuthToken.js";

// Create User
export const createUser = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  try {
    const findUser = await UserSchema.findOne({ email: email });
    if (!findUser) {
      // Create a new user
      const newUser = await UserSchema.create(req.body);
      res.status(201).json(newUser);
    } else {
      // User already exists
      throw new Error("User Already Exists");
    }
  } catch (err) {
    console.log("Error while creating user");
    next(err);
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // checking user if exist or not
    if (!email && !password) {
      throw new Error("All fields are mandatory");
    }
    if (!email || email.trim() == "") {
      throw new Error("Email is required");
    }
    if (!password || password == "") {
      throw new Error("Password is required");
    }
    const findUser = await UserSchema.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      // res.status(200).json({ ...findUser, token: generateToken(findUser?._id) });
      res.status(200).json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      // console.log("Login failed");
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

