import { CouponSchema } from "../models/coupon.model.js";
import { validateMongodbId } from "../utils/validateMongoID.js";

import asyncHandler from "express-async-handler";

export const createCoupon = asyncHandler(async (req, res, next) => {
  try {
    const createCoupon = await CouponSchema.create(req.body);
    res.status(201).json(createCoupon);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getAllCoupons = asyncHandler(async (req, res, next) => {
  try {
    const getAllCoupons = await CouponSchema.find();
    res.status(200).json(getAllCoupons);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Provide Id to update");
  }
  validateMongodbId(id);
  try {
    const updateCoupon = await CouponSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateCoupon);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new Error("Provide Id to delete");
  }
  validateMongodbId(id);
  try {
    const deleteCoupon = await CouponSchema.findByIdAndDelete(id);
    res.status(200).json(deleteCoupon);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
