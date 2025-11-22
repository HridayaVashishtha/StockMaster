import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  shortCode: { 
    type: String, 
    required: true,
    unique: true
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Location", locationSchema);