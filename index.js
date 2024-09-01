import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import connectToMongoDb from "./connection.js";
import UserRouter from "./Router/userRouter.js";
import BlogRouter from "./Router/blogRouter.js";
import dotenv from "dotenv";
import companyRouter from "./Router/companyRouter.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();


const mongoUrl = process.env.MONGOURL;
connectToMongoDb(mongoUrl);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", socket.id);
  });

  socket.on("signal", (data) => {
    io.to(data.target).emit("signal", {
      caller: socket.id,
      signal: data.signal,
    });
  });

  socket.on("code-update", (newCode) => {
    socket.broadcast.emit("code-update", newCode); // Broadcast code updates to all other clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/",UserRouter);
app.use("/", BlogRouter);
app.use("/",companyRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
