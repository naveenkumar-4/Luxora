import asynchandler from "express-async-handler";
import fs from "fs";

import { BlogSchema } from "../models/blog.model.js";
import { UserSchema } from "../models/user.model.js";
import { validateMongodbId } from "../utils/validateMongoID.js";
import mongoose from "mongoose";
import { cloudinaryUploadImg } from "../utils/cloudinary.js";

const ObjectId = mongoose.Schema.Types.ObjectId;

export const createBlog = asynchandler(async (req, res, next) => {
  try {
    const newBlog = await BlogSchema.create(req.body);
    res.status(201).json({ success: true, newBlog });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const updateBlog = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await BlogSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({ success: true, updateBlog });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getBlog = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getBlog = await BlogSchema.findById(id).populate("Likes");
    const updateViews = await BlogSchema.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, getBlog });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const getAllBlogs = asynchandler(async (req, res, next) => {
  try {
    const getAllBlog = await BlogSchema.find();
    res.status(200).json({ success: true, getAllBlog });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const deleteBlog = asynchandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteBlog = await BlogSchema.findByIdAndDelete(id);
    res.status(201).json({ success: true, deleteBlog });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

export const likeBlog = asynchandler(async (req, res, next) => {
  const { blogId } = req.body;
  //   blogId = new ObjectId(blogId);
  validateMongodbId(blogId);

  //   Find the blog which you want to be liked
  const blog = await BlogSchema.findById(blogId);
  //   Find the login user
  const loginUserId = req?.user?._id;
  //   Find if the user has liked the blog
  const isLiked = blog?.isLiked;
  //   Find if the user has disliked the blog
  const alreadyDisliked = blog?.DisLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyDisliked) {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      { $pull: { DisLikes: loginUserId }, isDisliked: false },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { Likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $push: { Likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

export const disLikeBlog = asynchandler(async (req, res, next) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  const blog = await BlogSchema.findById(blogId);
  const loginUserId = req?.user?._id;
  const isDisLiked = blog?.isDisliked;
  const alreadyLiked = blog?.Likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alreadyLiked) {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      { $pull: { Likes: loginUserId }, isLiked: false },
      { new: true }
    );
    res.json(blog);
  }

  if (isDisLiked) {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $pull: { DisLikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await BlogSchema.findByIdAndUpdate(
      blogId,
      {
        $push: { DisLikes: loginUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});
export const uploadImages = asynchandler(async (req, res, next) => {
  console.log(req.files);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
    }
    const findBlog = await BlogSchema.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    console.log(findBlog);
    res.json(findBlog);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
