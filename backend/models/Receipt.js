import mongoose from 'mongoose';

const receiptItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityExpected: { type: Number, required: true, min: 0 },
  quantityReceived: { type: Number, default: 0, min: 0 }
});

const receiptSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  fromLocation: { type: String, default: 'Vendors' },
  toLocation: { type: String, default: 'WH/Stock1' },
  scheduleDate: { type: Date },
  responsible: { type: String, default: '' },
  status: {
    type: String,
    enum: ['DRAFT', 'READY', 'DONE', 'CANCELLED', 'WAITING'],
    default: 'READY'
  },
  items: [receiptItemSchema],
  note: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  validatedAt: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Receipt', receiptSchema);