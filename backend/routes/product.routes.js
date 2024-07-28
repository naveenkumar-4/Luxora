import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";

export const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/:id", getProduct);
productRouter.get("/", getAllProducts);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);
