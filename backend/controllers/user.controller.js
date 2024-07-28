import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import generateToken from "../config/jwtAuthToken.js";
import generateRefreshToken from "../config/refershToken.js";
import { UserSchema } from "../models/user.model.js";
import { validateMongodbId } from "../utils/validateMongoID.js";

const ObjectId = mongoose.Types.ObjectId;

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
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateUser = await UserSchema.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
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

// Handle refresh token
export const handleRefreshToken = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) {
    throw new Error("There is no refersh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await UserSchema.findOne({ refreshToken });
  if (!user) {
    throw new Error("No Refresh token present in DB or it is not matched");
  }
  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    console.log(`id  : ${decoded}`);
    if (err || user.id !== decoded.id) {
      throw new Error("Something wrong with Refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });

  // res.status(200).json(user);
});

// logout user
export const logout = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await UserSchema.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //Forbidden
  }
  await UserSchema.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// Update User
export const updateUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updateUser = await UserSchema.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
        // role: req?.body?.role,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const getUsers = await UserSchema.find();
    res.status(200).json(getUsers);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Get a single user
export const getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (!id) {
      throw new Error("Provide Id of the user");
    }
    console.log(id);
    const getUser = await UserSchema.findById(new ObjectId(id));
    if (!getUser) {
      throw new Error("User not found");
    }
    res.status(200).json(getUser);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Delete a User
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    if (!id) {
      throw new Error("Provide Id of the user");
    }
    console.log(id);
    const deleteUser = await UserSchema.findByIdAndDelete(new ObjectId(id));
    if (!deleteUser) {
      throw new Error("User not found");
    }
    res.status(200).json({ deletedUser: deleteUser });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const blockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blockUser = await UserSchema.findByIdAndUpdate(
      new ObjectId(id),
      {
        isBlocked: true,
      },
      {
        new: true,
      },
      {
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "User is Blocked",
      blockedUser: blockUser,
    });
  } catch (err) {
    console.log(err.msg);
    next(err);
  }
});

export const unBlockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unBlockUser = await UserSchema.findByIdAndUpdate(
      new ObjectId(id),
      {
        isBlocked: false,
      },
      {
        new: true,
      },
      {
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "User is UnBlocked",
      blockedUser: unBlockUser,
    });
  } catch (err) {
    console.log(err.msg);
    next(err);
  }
});
