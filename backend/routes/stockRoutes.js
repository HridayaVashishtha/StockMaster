import express from "express";
import { getAllStock, addReceipt, addDelivery, transferStock, adjustStock } from "../controllers/stockController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getAllStock);
router.post("/receipt", auth, addReceipt);
router.post("/delivery", auth, addDelivery);
router.post("/transfer", auth, transferStock);
router.post("/adjust", auth, adjustStock);

export default router;
