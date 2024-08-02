import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import uniqid from "uniqid";

import generateToken from "../config/jwtAuthToken.js";
import generateRefreshToken from "../config/refershToken.js";
import { UserSchema } from "../models/user.model.js";
import { ProductSchema } from "../models/product.model.js";
import { CartSchema } from "../models/cart.model.js";
import { validateMongodbId } from "../utils/validateMongoID.js";
import { sendEmail } from "./email.controller.js";
import { CouponSchema } from "../models/coupon.model.js";
import { OrderSchema } from "../models/order.model.js";

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

// Admin login
export const loginAdmin = asyncHandler(async (req, res, next) => {
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
    const findAdmin = await UserSchema.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("You are not Authorized");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      // res.status(200).json({ ...findUser, token: generateToken(findUser?._id) });
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      const updateUser = await UserSchema.findByIdAndUpdate(
        findAdmin._id,
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
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
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
  await UserSchema.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
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
      }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updateUser);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Save user address
export const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updateUser = await UserSchema.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
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

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { password } = req.body;
  console.log(password);
  validateMongodbId(_id);
  const user = await UserSchema.findById(_id);
  if (!password) {
    res.status(400).json({ message: "Provide new password for updation" });
  }
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

export const forgotPasswordToken = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) {
    throw new Error("User not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi, please follow this link to reset your password.This is link is valid till 10 minutes from now. <a href="http://localhost:3000/api/user/reset-password/${token}">Click Here</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await UserSchema.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token Expired, Please try again later");
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json(user);
});

export const getWishList = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const findUser = await UserSchema.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const userCart = asyncHandler(async (req, res, next) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    let products = [];
    const user = await UserSchema.findById(_id);
    // check if user already have product in cart
    const alreadyExistCart = await CartSchema.findOne({ orderedBy: user._id });
    if (alreadyExistCart) {
      await CartSchema.deleteOne({ _id: alreadyExistCart._id });
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await ProductSchema.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = getPrice.price;
      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      let quantity = products[i].count;
      let price = products[i].price;
      cartTotal += quantity * price;
    }
    const newCart = await new CartSchema({
      products,
      cartTotal,
      orderedBy: user?._id,
    }).save();

    console.log(newCart);
    console.log(products, cartTotal);
    res.status(201).json(newCart);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const cart = await CartSchema.findOne({ orderedBy: _id }).populate(
      "products.product"
    );
    res.status(200).json(cart);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const emptyUserCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const cart = await CartSchema.findOne({ orderedBy: _id });
    if (cart) {
      const deletedCart = await CartSchema.findOneAndDelete({ orderedBy: _id });
      res.json({
        deletedCart: deletedCart,
      });
    } else {
      res.json("Cart is Empty");
    }
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const validCoupon = await CouponSchema.findOne({ name: coupon });
  // console.log(validCoupon);
  if (!validCoupon) {
    res.status(400).json({ message: "Coupon is invalid" });
  }
  const user = await UserSchema.findOne({ _id });
  let { products, cartTotal } = await CartSchema.findOne({
    orderedBy: user._id,
  }).populate("products.product");
  if (!products) {
    throw new Error("Cart is Empty");
  }
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await CartSchema.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount: totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

export const createOrder = asyncHandler(async (req, res, next) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    if (!COD) throw new Error("Create cash on delivery failed");
    const user = await UserSchema.findById(_id);
    const userCart = await CartSchema.findOne({ orderedBy: user._id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new OrderSchema({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: "Cash On Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderedBy: user._id,
      orderStatus: "Cash On Delivery",
    }).save();

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    const updated = await ProductSchema.bulkWrite(update, {});
    res.json({ message: "Success" });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// getOrders
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const userOrders = await OrderSchema.findOne({ orderedBy: _id })
      .populate("products.product")
      .exec();
    if (!userOrders) {
      throw new Error("No orders");
    }
    res.json(userOrders);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// update order status
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateOrder = await OrderSchema.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrder);
  } catch (err) {
    console.log(err.message);
    next(errF);
  }
});
