import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createProduct, getProducts } from "../controllers/productController.js";
const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", protect, getProducts);

export default router;
