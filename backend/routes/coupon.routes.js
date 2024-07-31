import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";

export const couponRouter = express.Router();

couponRouter.post("/", authJwt, isAdmin, createCoupon);
couponRouter.get("/", authJwt, isAdmin, getAllCoupons);
couponRouter.put("/:id", authJwt, isAdmin, updateCoupon);
couponRouter.delete("/:id", authJwt, isAdmin, deleteCoupon);
