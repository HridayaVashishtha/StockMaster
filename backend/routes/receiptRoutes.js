import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  validateReceipt,
  cancelReceipt,
  deleteReceipt,
  getReceiptStatistics
} from "../controllers/receiptController.js";

const router = express.Router();

router.get("/", auth, getAllReceipts);
router.get("/statistics", auth, getReceiptStatistics);
router.get("/:id", auth, getReceiptById);
router.post("/", auth, createReceipt);
router.put("/:id", auth, updateReceipt);
router.post("/:id/validate", auth, validateReceipt);
router.post("/:id/cancel", auth, cancelReceipt);
router.delete("/:id", auth, deleteReceipt);

export default router;