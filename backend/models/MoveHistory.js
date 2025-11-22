import mongoose from "mongoose";

const moveHistorySchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["RECEIPT", "DELIVERY", "TRANSFER", "ADJUSTMENT"],
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  fromLocation: { 
    type: String,
    default: null
  },
  toLocation: { 
    type: String,
    default: null
  },
  reference: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    default: null
  },
  status: { 
    type: String, 
    enum: ["DRAFT", "DONE", "CANCELLED"],
    default: "DONE"
  },
  note: {
    type: String,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Index for faster queries
moveHistorySchema.index({ product: 1, createdAt: -1 });
moveHistorySchema.index({ type: 1 });
moveHistorySchema.index({ reference: 1 });

export default mongoose.model("MoveHistory", moveHistorySchema);