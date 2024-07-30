import asyncHandler from "express-async-handler";

import { validateMongodbId } from "../utils/validateMongoID.js";
import { BrandSchema } from "../models/brand.model.js";

export const createBrand = asyncHandler(async (req, res, next) => {
  try {
    const newBrand = await BrandSchema.create(req.body);
    res.status(201).json(newBrand);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBrand = await BrandSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(updateBrand);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBrand = await BrandSchema.findByIdAndDelete(id);
    res.status(201).json(deleteBrand);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBrand = await BrandSchema.findById(id);
    res.status(201).json(getBrand);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getAllBrands = asyncHandler(async (req, res, next) => {
  try {
    const getAllBrands = await BrandSchema.find();
    res.status(201).json(getAllBrands);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
