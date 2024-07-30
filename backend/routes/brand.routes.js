import express from "express";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller.js";

export const brandRouter = express.Router();

brandRouter.post("/", authJwt, isAdmin, createBrand);
brandRouter.put("/:id", authJwt, isAdmin, updateBrand);
brandRouter.delete("/:id", authJwt, isAdmin, deleteBrand);
brandRouter.get("/:id", getBrand);
brandRouter.get("/", getAllBrands);
