import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  shortCode: { 
    type: String, 
    required: true,
    unique: true
  },
  address: { 
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Warehouse", warehouseSchema);
