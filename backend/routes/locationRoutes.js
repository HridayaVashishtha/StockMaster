import express from "express";
import {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, createLocation);
router.get("/", auth, getLocations);
router.get("/:id", auth, getLocationById);
router.put("/:id", auth, updateLocation);
router.delete("/:id", auth, deleteLocation);

export default router;