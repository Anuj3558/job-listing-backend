import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import connectToMongoDb from "./connection.js";
import UserRouter from "./Router/userRouter.js";
import BlogRouter from "./Router/blogRouter.js";
import dotenv from "dotenv";


dotenv.config();

const app = express();


const mongoUrl = process.env.MONGOURL;
connectToMongoDb(mongoUrl);




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/",UserRouter);
app.use("/", BlogRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
