import express from "express";
import {
  addRating,
  addToWishList,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  uploadImages,
} from "../controllers/product.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
import { productImgResize, uploadImage } from "../middlewares/uploadImages.js";

export const productRouter = express.Router();

productRouter.post("/", authJwt, isAdmin, createProduct);
productRouter.put('/upload/:id', authJwt, isAdmin, uploadImage.array('images', 10), productImgResize, uploadImages)
productRouter.get("/:id", getProduct);
productRouter.get("/", getAllProducts);
productRouter.put("/wish-list", authJwt, addToWishList);
productRouter.put("/rating", authJwt, addRating);

productRouter.put("/:id", authJwt, isAdmin, updateProduct);
productRouter.delete("/:id", authJwt, isAdmin, deleteProduct);
