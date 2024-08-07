import asyncHandler from "express-async-handler";

import { validateMongodbId } from "../utils/validateMongoID.js";
import { ProdcutCategorySchema } from "../models/product.category.model.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const newCategory = await ProdcutCategorySchema.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await ProdcutCategorySchema.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(201).json(updateCategory);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await ProdcutCategorySchema.findByIdAndDelete(id);
    res.status(201).json(deleteCategory);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getCategory = await ProdcutCategorySchema.findById(id);
    res.status(201).json(getCategory);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});


export const getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const getAllCategories = await ProdcutCategorySchema.find();
    res.status(201).json(getAllCategories);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
