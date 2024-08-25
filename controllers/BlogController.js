// controllers/BlogController.js
import Blog from "../model/blogModel"; // Import the Blog model

const HandleBlogUpload = async (req, res) => {
  try {
    const { title, content, categories, image } = req.body;

    const newBlog = new Blog({ title, content, categories, image });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { HandleBlogUpload };
