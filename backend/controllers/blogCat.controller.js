import asyncHandler from "express-async-handler";

import { validateMongodbId } from "../utils/validateMongoID.js";
import { BlogCategorySchema } from "../models/blogCat.model.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const newCategory = await BlogCategorySchema.create(req.body);
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
    const updateCategory = await BlogCategorySchema.findByIdAndUpdate(
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
    const deleteCategory = await BlogCategorySchema.findByIdAndDelete(id);
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
    const getCategory = await BlogCategorySchema.findById(id);
    res.status(201).json(getCategory);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});


export const getAllCategories = asyncHandler(async (req, res, next) => {
  try {
    const getAllCategories = await BlogCategorySchema.find();
    res.status(201).json(getAllCategories);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
