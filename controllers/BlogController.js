// controllers/BlogController.js
import Blog from "../model/BlogModel.js";

import cloudinary from "../config/cloudinaryConfig.js";
import UserProfile from "../model/userModel.js";


const HandleBlogUpload = async (req, res) => {
  try {
    const { userId,title,content  } = req.body;

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
      userId,
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
}

const handleBlogs = async (req, res) => {
  try {
    // Retrieve all blog documents from the collection
    const allBlogs = await Blog.find(); // Use await to get the result from the promise

    // Send the retrieved blogs as the response
    res.status(200).json(allBlogs);
  } catch (error) {
    // Log the error and send an error response
    console.error("Error retrieving blogs:", error.message);
    res.status(500).json({
      message: "Error retrieving blogs",
      error: error.message,
    });
  }
};
const handleSingleBlog = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const blog = await Blog.findById(id)  ;
    const userId = blog.userId;
    
    console.log(userId);
    const user = await UserProfile.findOne({ uid :userId});
    console.log(user);
    if(!user){
      return res.status(404).json({ error: "User not found" });
    }
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({
      blog: blog,
      userName: user.name,
      userProfileImg: user.profileUrl,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { handleBlogs, HandleBlogUpload, handleSingleBlog };