import express from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyUserCart,
  applyCoupon,
} from "../controllers/user.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
export const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/forget-password-token", forgotPasswordToken);
userRouter.put("/reset-password/:token", resetPassword);

userRouter.put("/update-password", authJwt, updatePassword);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", loginAdmin);
userRouter.get("/get-all-Users", getAllUsers);
userRouter.get("/refresh-token", handleRefreshToken);
userRouter.get("/logout", logout);
userRouter.get("/wishList", authJwt, getWishList);
userRouter.post("/cart", authJwt, userCart);
userRouter.post("/cart/apply-coupon", authJwt, applyCoupon);
userRouter.get("/user-cart", authJwt, getUserCart);
userRouter.delete("/empty-cart", authJwt, emptyUserCart);

userRouter.get("/:id", authJwt, isAdmin, getSingleUser);
userRouter.delete("/:id", deleteUser);

userRouter.put("/update-user", authJwt, updateUser);
userRouter.put("/save-address", authJwt, saveAddress);
userRouter.put("/block-user/:id", authJwt, isAdmin, blockUser);
userRouter.put("/unblock-user/:id", authJwt, isAdmin, unBlockUser);
