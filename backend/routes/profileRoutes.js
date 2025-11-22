import express from "express";
import auth from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, updatePassword } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.put("/password", auth, updatePassword);

export default router;