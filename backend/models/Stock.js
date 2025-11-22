import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  quantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model("Stock", stockSchema);
