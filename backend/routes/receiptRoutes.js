import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  validateReceipt,
  getReceiptStatistics
} from "../controllers/receiptController.js";

const router = express.Router();

router.get("/statistics", auth, getReceiptStatistics);
router.get("/", auth, getReceipts);
router.get("/:id", auth, getReceiptById);
router.post("/", auth, createReceipt);
router.put("/:id", auth, updateReceipt);
router.delete("/:id", auth, deleteReceipt);
router.post("/:id/validate", auth, validateReceipt);

export default router;