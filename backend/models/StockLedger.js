import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  type: { type: String, enum: ["RECEIPT", "DELIVERY", "TRANSFER", "ADJUSTMENT"], required: true },
  reference: String,
  quantity: Number,
  previousQuantity: Number,
  newQuantity: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("StockLedger", stockLedgerSchema);
