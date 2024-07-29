import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import slugify from "slugify";

import { ProductSchema } from "../models/product.model.js";

const ObjectId = mongoose.Types.ObjectId;
export const createProduct = asyncHandler(async (req, res, next) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await ProductSchema.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err.message);
    next(err);
    // throw new Error(err);
  }
});

// Update Product
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(`params Id : ${id}`);
  console.log(`params Id : ${JSON.stringify(req.params)}`);
  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Provide Id for updation",
      });
    }
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await ProductSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(`Updated product : ${updateProduct}`);
    res.status(201).json(updateProduct);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(`params Id : ${id}`);
  console.log(`params Id : ${JSON.stringify(req.params)}`);
  try {
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Provide Id for deletion",
      });
    }
    const deleteProduct = await ProductSchema.findOneAndDelete(id);
    console.log(`Deleted product : ${deleteProduct}`);
    res.status(201).json({ message: "Product Deleted", deleteProduct });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Get product
export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const findProduct = await ProductSchema.findById(
      new mongoose.Types.ObjectId(id)
    );
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(findProduct);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

// Get all Products
export const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    // Filtering Products
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);
    // console.log(`queryObj:${JSON.stringify({queryObj})}`);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = ProductSchema.find(JSON.parse(queryStr));
    // console.log(`Query : ${query}`);

    // Sorting Products
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination for produts
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await ProductSchema.countDocuments();
      if (skip >= productCount) {
        throw new Error("This page is not exist");
      }
    }
    console.log(page, limit, skip);

    const allProducts = await query;
    if (allProducts.length === 0) {
      res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(allProducts);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
