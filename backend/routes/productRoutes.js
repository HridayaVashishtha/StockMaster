import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductHistory,
  bulkStockUpdate,
  addStockToProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", auth, getAllProducts);
router.get("/:id", auth, getProductById);
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);
router.get("/:id/history", auth, getProductHistory);

// New routes for stock operations
router.post("/bulk-stock", auth, bulkStockUpdate);
router.post("/:id/add-stock", auth, addStockToProduct);

export default router;
