// models/Comment.js
import mongoose from "mongoose";
import Blog from "./BlogModel.js"; // Referencing the blog model
import UserProfile from "./userModel.js";

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    blogPost: {
      type: String,
      ref: "Blog", // Reference to Blog model
      required: true,
    },
    userProfile: {
      type: String,
      
      required: true,
    },
    userName:{
      type:String,
      required: true,
      
    },
    content: {
      type: String,
      required: true,
    },  
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
