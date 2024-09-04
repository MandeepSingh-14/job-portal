import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { applyJob, findApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
const router = Router();

router.route("/apply/:id").get(verifyJWT,applyJob);
router.route("/get").get(verifyJWT,getAppliedJobs);
router.route("/:id/applicants").get(verifyJWT,findApplicants);//The :id parameter represents the unique identifier of the job for which you want to find the applicants. This is how you tell the server which specific job you are referring to. 
router.route("/status/:id/update").post(verifyJWT,updateStatus); //The structure /status/:id/update clearly conveys that the request is meant to update the status of a specific job application.


export default router