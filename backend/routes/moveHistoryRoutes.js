import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllMoveHistory,
  getProductMoveHistory,
  createMove,
  getMoveStatistics
} from "../controllers/moveHistoryController.js";

const router = express.Router();

router.get("/", auth, getAllMoveHistory);
router.get("/statistics", auth, getMoveStatistics);
router.get("/product/:productId", auth, getProductMoveHistory);
router.post("/", auth, createMove);

export default router;