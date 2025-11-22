import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sku: { type: String, unique: true, sparse: true }, // sparse allows null/undefined
  costPerUnit: { type: Number, required: true, default: 0 },
  onHand: { type: Number, default: 0 },
  freeToUse: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  unit: { type: String, default: 'pcs' }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
