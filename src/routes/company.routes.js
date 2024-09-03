import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getCompany, getCompanybyID, registerCompany, updatedCompany } from "../controllers/company.controller.js";

const router = Router();


router.route("/register").post(verifyJWT,registerCompany)
router.route("/get").get(verifyJWT,getCompany);
router.route("/get/:id").get(verifyJWT,getCompanybyID);
router.route("/update/:id").put(verifyJWT,updatedCompany);


export default router