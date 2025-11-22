import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, unique: true, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  uom: { type: String, default: "Unit" },
  reorderLevel: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
