// controllers/BlogController.js
import Blog from "../model/BlogModel.js";

import cloudinary from "../config/cloudinaryConfig.js";

export const HandleBlogUpload = async (req, res) => {
  try {
    const { name,title, content } = req.body;
    let { categories } = req.body;

    // Parse categories if it's a string
    if (typeof categories === "string") {
      categories = JSON.parse(categories);
    }

    let imageUrl = "";
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    // Create the new blog post with the uploaded image URL
    const newBlog = new Blog({
      name,
      title,
      content,
      categories,
      image: imageUrl,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error occurred while uploading blog:", error.message);
    res.status(500).json({
      message: "Error occurred while creating blog",
      error: error.message,
    });
  }
};

