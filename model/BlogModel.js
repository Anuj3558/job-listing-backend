// models/Blog.mjs
import mongoose from "mongoose";
import UserProfile from "./userModel.js";

const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: UserProfile,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    categories: [
      {
        value: {
          type: String,
        },
        lable: {
          type: String,
        },
      },
    ],
    image: {
      type: String, // URL of the uploaded image
      required: false,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog