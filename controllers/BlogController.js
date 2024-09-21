// controllers/BlogController.js
import Blog from "../model/BlogModel.js";
import dotenv from "dotenv";
import cloudinary from "../config/cloudinaryConfig.js";
import UserProfile from "../model/userModel.js";
import Comment from "../model/Comment.js";
// Make sure to include these imports:
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import Like from "../model/Like.js";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const HandleBlogUpload = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

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
    const prompt = `Convert the following text into HTML code with appropriate Tailwind CSS classes to display the content on the screen. Ensure that the text is wrapped in relevant HTML tags such as <h1>, <p>, <div>, etc., and apply Tailwind CSS classes to style the elements for a modern and responsive design. The styling should include margin, padding, font size, color, and layout as appropriate for each element. Do not use shadow or rounded styling in the classes and just give html  from body tag also in response only send the content do not send extra text ,content:${content}`;

    const htmlContent = await model.generateContent(prompt);
    const htmlcode = htmlContent.response.candidates[0].content.parts[0].text;
    // Create the new blog post with the uploaded image URL
    const newBlog = new Blog({
      userId,
      title,
      content: htmlcode,
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

  try {
    const blog = await Blog.findById(id);
    const userId = blog.userId;

    const user = await UserProfile.findOne({ uid: userId });
    // console.log(user);
    if (!user) {
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
const fetchComments = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch comments based on the blogPost ID
    const comments = await Comment.find({ blogPost: id });
    // Extract only the 'content' field from each comment
    const commentsContent = comments.map((comment) => ({
      content: comment.content,
      createdAt: comment.createdAt,
      userProfile: comment.userProfile,
      name: comment.userName,
    }));

    // Send the extracted content as a response
    res.status(200).json(commentsContent);
  } catch (error) {
    console.error("Error occurred during fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
const handleComment = async (req, res) => {
  const { blogId, userId, content } = req.body;

  // Convert userId to ObjectId if it's not already

  try {
    const user = await UserProfile.findOne({ uid: userId });

    const comment = new Comment({
      blogPost: blogId,
      userProfile: user.profileUrl,
      userName: user.name,
      content,
    });

    await comment.save();

    // Push the comment to the blog post
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

const handleLike = async (req, res) => {
  const { id } = req.params; // Blog ID
  const { userId } = req.body; // User ID

  try {
    // Find the blog post by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check if the user has already liked this blog post
    const existingLike = await Like.findOne({ blogPost: id, userId });

    if (existingLike) {
      // User has already liked the post, so remove the like (unlike)
      await Like.findByIdAndDelete(existingLike._id);
      console.log("Like removed");

      // Remove the userId from the blog's likes array
      blog.likes = blog.likes.filter((like) => like !== userId);
      await blog.save();

      return res.status(200).json({
        message: "Like removed",
        likes: blog.likes, // Return the updated likes array
      });
    } else {
      // User has not liked the post, so add a new like
      const like = new Like({ blogPost: id, userId });
      await like.save();
      console.log("Like added");

      // Add the userId to the blog's likes array
      blog.likes.push(userId);
      await blog.save();

      return res.status(201).json({
        message: "Like added",
        likes: blog.likes, // Return the updated likes array
      });
    }
  } catch (error) {
    console.error("Error handling like/unlike:", error);
    res.status(500).json({ message: "Error handling like/unlike", error });
  }
};



export {
  handleBlogs,
  HandleBlogUpload,
  handleSingleBlog,
  handleComment,
  fetchComments,
  handleLike,
};
