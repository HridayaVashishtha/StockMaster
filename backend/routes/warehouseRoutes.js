import express from "express";
import { 
  createWarehouse, 
  getWarehouses,
  getWarehouseById,
  updateWarehouse,
  deleteWarehouse
} from "../controllers/warehouseController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createWarehouse);
router.get("/", protect, getWarehouses);
router.get("/:id", protect, getWarehouseById);
router.put("/:id", protect, updateWarehouse);
router.delete("/:id", protect, deleteWarehouse);

export default router;
