import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema(
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
export const CategorySchema = new mongoose.model("ProductCategory", productCategorySchema);
