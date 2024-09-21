import { Router } from "express";
import {
  HandleBlogUpload,
  handleBlogs,
  handleSingleBlog,
  handleComment,
  fetchComments,
  handleLike,
} from "../controllers/BlogController.js";
import upload from "../middleware/multer.js";

const BlogRouter = Router(); // Invoke Router to create an instance

// Define the route for handling blog uploads
BlogRouter.post("/submitblog", upload.single("image"), HandleBlogUpload);
BlogRouter.get("/handleblogs", handleBlogs);
BlogRouter.get("/singleblog/:id", handleSingleBlog);
BlogRouter.post("/blog/comment", handleComment);
BlogRouter.get("/comments/:id", fetchComments);
BlogRouter.post("/like/:id",handleLike);
export default BlogRouter;
