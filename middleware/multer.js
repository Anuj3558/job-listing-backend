import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_images", // specify the folder in Cloudinary
    allowedFormats: ["jpg", "png"],
  },
});

const upload = multer({ storage: storage });

export default upload;
