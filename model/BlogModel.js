// models/Blog.mjs
import mongoose from "mongoose";
import UserProfile from "./userModel.js";
import Comment from "./Comment.js"; // New comment model
import Like from "./Like.js"; // New like model

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
        label: {
          type: String,
        },
      },
    ],
    image: {
      type: String, // URL of the uploaded image
      required: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // Reference to Comment schema
      },
    ],
    likes: [
      {
        type: String,
        required:true,
        unique:true, // Reference to Like schema
      },
    ],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
