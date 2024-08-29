import { Router } from "express";
import { getCompanyData, handleCompanyRegistration } from "../controllers/companyController.js";
import upload from "../middleware/multer.js";

const companyRouter = Router();



companyRouter.route("/register-company").post( upload.single("logoUrl"),handleCompanyRegistration);
//companyRouter.route("/login-to-company").post(handleLoginToComapny);
companyRouter.route("/get-data").post(getCompanyData)

export default companyRouter;