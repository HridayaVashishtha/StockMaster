import mongoose from "mongoose";

const operationSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ["Receipt", "Delivery", "Internal", "Adjustment"],
    required: true
  },

  status: {
    type: String,
    enum: ["Draft", "Waiting", "Ready", "Done", "Canceled"],
    default: "Draft"
  },

  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
  }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
{ timestamps: true });

export default mongoose.model("Operation", operationSchema);
