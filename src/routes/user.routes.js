import { Router } from "express";
import { registerUser, loginUser, logoutUser, updateAccountDetails, updateBio, updateSkills,changePassword } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/profile/update").post(verifyJWT, updateAccountDetails);
router.route("/bio/update").post(verifyJWT, updateBio);
router.route("/skills/update").post(verifyJWT, updateSkills);
router.route("/password/change").post(verifyJWT, changePassword);
export default router;
