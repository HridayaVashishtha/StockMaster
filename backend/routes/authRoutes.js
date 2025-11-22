import express from "express";
import { register, login, requestOTP, resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-otp", requestOTP);
router.post("/reset-password", resetPassword);

export default router;
