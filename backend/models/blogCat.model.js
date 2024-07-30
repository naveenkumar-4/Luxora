import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

//Export the model
export const BlogCategorySchema = new mongoose.model("BlogCategory", blogCategorySchema);
