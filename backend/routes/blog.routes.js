import express from "express";

import {
  createBlog,
  deleteBlog,
  disLikeBlog,
  getAllBlogs,
  getBlog,
  likeBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
import { authJwt, isAdmin } from "../middlewares/jwtAuth.js";

export const blogRouter = express.Router();

blogRouter.post("/", authJwt, isAdmin, createBlog);
blogRouter.put("/likes", authJwt, likeBlog);
blogRouter.put("/dislikes", authJwt, disLikeBlog);
blogRouter.put("/:id", authJwt, isAdmin, updateBlog);
blogRouter.get("/:id", getBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.delete("/:id", authJwt, isAdmin, deleteBlog);
