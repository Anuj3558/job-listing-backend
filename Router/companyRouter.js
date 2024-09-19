import { Router } from "express";
import { getCompanyData, handleCompanyRegistration,handleLoginToCompany,HandleJobPost, SaveDraft, getJobs, getAllJobs,closePosition } from "../controllers/companyController.js";
import upload from "../middleware/multer.js";

const companyRouter = Router();



companyRouter.route("/register-company").post( upload.single("logoUrl"),handleCompanyRegistration);
companyRouter.route("/login-to-company").post(handleLoginToCompany);
companyRouter.route("/get-data").post(getCompanyData)
companyRouter.route("/post-job").post(HandleJobPost);
companyRouter.route("/save-draft").post(SaveDraft);
companyRouter.route("/get-jobs/?").get(getJobs);
companyRouter.route("/get-all-jobs").get(getAllJobs);
companyRouter.route("/close-position").post(closePosition);

export default companyRouter;