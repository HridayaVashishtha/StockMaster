import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addStockToProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Read
router.get("/", auth, getAllProducts);
router.get("/:id", auth, getProductById);

// Create/Update/Delete
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

// Add stock
router.post("/:id/add-stock", auth, addStockToProduct);

export default router;
