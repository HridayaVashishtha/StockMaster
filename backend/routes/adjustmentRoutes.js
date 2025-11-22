import express from 'express';
import { 
  getAdjustments, 
  getAdjustmentById, 
  createAdjustment, 
  updateAdjustment, 
  deleteAdjustment 
} from '../controllers/adjustmentController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", auth, createAdjustment);
router.get("/", auth, getAdjustments);
router.get("/:id", auth, getAdjustmentById);
router.put("/:id", auth, updateAdjustment);
router.delete("/:id", auth, deleteAdjustment);

export default router;