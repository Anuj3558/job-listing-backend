// models/Like.js
import mongoose from "mongoose";
import Blog from "./BlogModel.js"; // Referencing the blog model
import UserProfile from "./userModel.js";

const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    blogPost: {
      type: String,
      ref: "Blog", // Reference to Blog model
      required: true,
    },
    userId: {
      type:String,
      ref: UserProfile,
      required: true,
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);

export default Like;
