import { Router } from "express";
import { HandleBlogUpload } from "../controllers/BlogController.js";

const BlogRouter = Router(); // Invoke Router to create an instance

// Define the route for handling blog uploads
BlogRouter.route("/upload-blog").post(HandleBlogUpload);

export default BlogRouter;
