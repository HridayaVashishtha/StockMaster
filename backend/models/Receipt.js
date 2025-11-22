import mongoose from "mongoose";

const receiptItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantityExpected: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantityReceived: { 
    type: Number, 
    default: 0,
    min: 0
  }
});

const receiptSchema = new mongoose.Schema({
  reference: { 
    type: String, 
    required: true, 
    unique: true 
  },
  supplier: { 
    type: String, 
    required: true 
  },
  items: [receiptItemSchema],
  fromLocation: { 
    type: String, 
    default: "Vendor" 
  },
  toLocation: { 
    type: String, 
    required: true,
    default: "WH/Stock1"
  },
  scheduleDate: { 
    type: Date,
    default: null
  },
  responsible: {
    type: String,
    default: null
  },
  status: { 
    type: String, 
    enum: ["DRAFT", "WAITING", "READY", "DONE", "CANCELLED"],
    default: "DRAFT"
  },
  note: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  validatedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Auto-generate reference number - FIXED VERSION
receiptSchema.pre('save', async function() {
  if (!this.reference || this.isNew) {
    const Receipt = mongoose.model('Receipt');
    const count = await Receipt.countDocuments();
    this.reference = `WH/IN/${String(count + 1).padStart(4, '0')}`;
  }
});

export default mongoose.model("Receipt", receiptSchema);