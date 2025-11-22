import mongoose from "mongoose";

const stockLedgerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  quantityChange: Number,
  reason: String,
  reference: { type: mongoose.Schema.Types.ObjectId, ref: "Operation" }
},
{ timestamps: true });

export default mongoose.model("StockLedger", stockLedgerSchema);
