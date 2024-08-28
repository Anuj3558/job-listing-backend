import { Router } from "express";
import {
  HandleRegisterWithGoogle,
  HandleRegisterWithEmailAndPassword,
  GetUserInfor,
  handleProfileSubmit,
  handleSaveChanges,
} from "../controllers/UserController.js"; // Import your controller functions

const UserRouter = Router();

// Route for registering a user with Google
UserRouter.post("/register/google", HandleRegisterWithGoogle);

// Route for registering a user with email and password
UserRouter.post("/register", HandleRegisterWithEmailAndPassword);

// Route for getting user information by UID
UserRouter.post("/info", GetUserInfor);

UserRouter.put("/completeprofile", handleProfileSubmit);
UserRouter.post("/savechanges", handleSaveChanges);

export default UserRouter;
