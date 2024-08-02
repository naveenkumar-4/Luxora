import mongoose, { mongo } from "mongoose";

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    Likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    DisLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk388HZ1FaG1t1764Mebszn9Y7zr-e40AkjmX0Pl5yBWmb5hHfzwrtlHHk3nOuxtJ3Brw&usqp=CAU",
    },
    author: {
      type: String,
      default: "Admin",
    },
    images: {
      type: Array,
    },
  },
  {
    toJOSN: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

export const BlogSchema = new mongoose.model("Blog", blogSchema);
