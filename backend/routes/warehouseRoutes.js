import express from "express";
import { createWarehouse, getWarehouses } from "../controllers/warehouseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, createWarehouse);
router.get("/", protect, getWarehouses);

export default router;
