import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { applyJob } from "../controllers/application.controller.js";
const router = Router();

router.route("/apply").post(verifyJWT,applyJob);
router.route("get").get(verifyJWT,)