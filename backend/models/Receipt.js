import mongoose from 'mongoose';

const receiptItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
  fromLocation: {
    type: String,
    default: 'Vendors'
  },
  toLocation: {
    type: String,
    default: 'WH/Stock1'
  },
  scheduleDate: {
    type: Date,
    default: Date.now
  },
  responsible: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['DRAFT', 'READY', 'DONE', 'CANCELLED'],
    default: 'READY'
  },
  items: [receiptItemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Receipt', receiptSchema);