import { Router } from "express";
import { HandleBlogUpload } from "../controllers/BlogController.js";
import upload from "../middleware/multer.js";

const BlogRouter = Router(); // Invoke Router to create an instance

// Define the route for handling blog uploads
BlogRouter.post("/submitblog", upload.single("image"), HandleBlogUpload);

export default BlogRouter;
