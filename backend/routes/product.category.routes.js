import express from "express";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/product.category.controller.js";

export const productCategoryRouter = express.Router();

productCategoryRouter.post("/", authJwt, isAdmin, createCategory);
productCategoryRouter.put("/:id", authJwt, isAdmin, updateCategory);
productCategoryRouter.delete("/:id", authJwt, isAdmin, deleteCategory);
productCategoryRouter.get("/:id", getCategory);
productCategoryRouter.get("/", getAllCategories);
