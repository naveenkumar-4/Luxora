import express from "express";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/product.category.controller.js";

export const categoryRouter = express.Router();

categoryRouter.post("/", authJwt, isAdmin, createCategory);
categoryRouter.put("/:id", authJwt, isAdmin, updateCategory);
categoryRouter.delete("/:id", authJwt, isAdmin, deleteCategory);
categoryRouter.get("/:id", getCategory);
categoryRouter.get("/", getAllCategories);
