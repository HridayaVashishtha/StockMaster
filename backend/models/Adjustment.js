import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  fromWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  toWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },
  toLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location"
  },
  reason: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Adjustment", adjustmentSchema);