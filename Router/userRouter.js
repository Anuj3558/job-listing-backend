import { Router } from "express";
import { HandleRegisterWithGoogle, HandleRegisterWithEmailAndPassword, GetUserInfor } from "../controllers/UserController.js"; // Import your controller functions

const UserRouter = Router();

// Route for registering a user with Google
UserRouter.post("/register/google", HandleRegisterWithGoogle);

// Route for registering a user with email and password
UserRouter.post("/register", HandleRegisterWithEmailAndPassword);

// Route for getting user information by UID
UserRouter.post("/info", GetUserInfor);

export default UserRouter;
