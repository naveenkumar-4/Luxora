import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";

export const productRouter = express.Router();

productRouter.post("/", authJwt, isAdmin, createProduct);
productRouter.get("/:id", getProduct);
productRouter.get("/", getAllProducts);
productRouter.put("/:id", authJwt, isAdmin, updateProduct);
productRouter.delete("/:id", authJwt, isAdmin, deleteProduct);
