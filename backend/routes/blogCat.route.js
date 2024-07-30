import express from "express";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/blogCat.controller.js";

export const blogCategoryRouter = express.Router();

blogCategoryRouter.post("/", authJwt, isAdmin, createCategory);
blogCategoryRouter.put("/:id", authJwt, isAdmin, updateCategory);
blogCategoryRouter.delete("/:id", authJwt, isAdmin, deleteCategory);
blogCategoryRouter.get("/:id", getCategory);
blogCategoryRouter.get("/", getAllCategories);
