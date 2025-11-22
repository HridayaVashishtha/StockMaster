import Receipt from "../models/Receipt.js";
import Product from "../models/Product.js";
import MoveHistory from "../models/MoveHistory.js";

// GET all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const { status, supplier, search } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (supplier) filter.supplier = { $regex: supplier, $options: 'i' };
    if (search) {
      filter.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
        { toLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const receipts = await Receipt.find(filter)
      .populate('items.product', 'name sku unit')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single receipt by ID
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('items.product', 'name sku unit costPerUnit')
      .populate('createdBy', 'name email')
      .populate('validatedBy', 'name email');
    
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE new receipt
export const createReceipt = async (req, res) => {
  try {
    const { supplier, items, toLocation, scheduleDate, responsible, note } = req.body;
    
    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ error: "Supplier and items are required" });
    }
    
    // Validate all products exist
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.product} not found` });
      }
    }
    
    const receipt = await Receipt.create({
      supplier,
      items,
      toLocation: toLocation || "WH/Stock1",
      scheduleDate,
      responsible,
      note,
      status: "DRAFT",
      createdBy: req.userId
    });
    
    await receipt.populate('items.product', 'name sku unit');
    await receipt.populate('createdBy', 'name email');
    
    res.status(201).json({ message: "Receipt created", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE receipt
export const updateReceipt = async (req, res) => {
  try {
    const { supplier, items, toLocation, scheduleDate, responsible, note, status } = req.body;
    const receipt = await Receipt.findById(req.params.id);
    
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    
    // Only drafts and waiting can be fully edited
    if (receipt.status === "DONE" || receipt.status === "CANCELLED") {
      return res.status(400).json({ error: "Cannot edit completed or cancelled receipts" });
    }
    
    if (supplier) receipt.supplier = supplier;
    if (items) receipt.items = items;
    if (toLocation) receipt.toLocation = toLocation;
    if (scheduleDate !== undefined) receipt.scheduleDate = scheduleDate;
    if (responsible !== undefined) receipt.responsible = responsible;
    if (note !== undefined) receipt.note = note;
    if (status) receipt.status = status;
    
    await receipt.save();
    await receipt.populate('items.product', 'name sku unit');
    
    res.json({ message: "Receipt updated", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VALIDATE receipt (mark as DONE and update stock)
export const validateReceipt = async (req, res) => {
  try {
    const { receivedQuantities } = req.body; // Optional: { productId: quantity }
    const receipt = await Receipt.findById(req.params.id)
      .populate('items.product');
    
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    
    if (receipt.status === "DONE") {
      return res.status(400).json({ error: "Receipt already validated" });
    }
    
    if (receipt.status === "CANCELLED") {
      return res.status(400).json({ error: "Cannot validate cancelled receipt" });
    }
    
    // Update received quantities
    if (receivedQuantities) {
      for (const item of receipt.items) {
        const productId = item.product._id.toString();
        if (receivedQuantities[productId] !== undefined) {
          item.quantityReceived = receivedQuantities[productId];
        } else {
          item.quantityReceived = item.quantityExpected;
        }
      }
    } else {
      // Default: mark all as received with expected quantity
      receipt.items.forEach(item => {
        item.quantityReceived = item.quantityExpected;
      });
    }
    
    // Update stock for each item
    for (const item of receipt.items) {
      if (item.quantityReceived > 0) {
        const product = await Product.findById(item.product._id);
        product.onHand += item.quantityReceived;
        product.freeToUse += item.quantityReceived;
        await product.save();
        
        // Log in move history
        await MoveHistory.create({
          product: item.product._id,
          type: "RECEIPT",
          quantity: item.quantityReceived,
          fromLocation: receipt.fromLocation,
          toLocation: receipt.toLocation,
          reference: receipt.reference,
          contact: receipt.supplier,
          status: "DONE",
          user: req.userId
        });
      }
    }
    
    receipt.status = "DONE";
    receipt.validatedBy = req.userId;
    receipt.validatedAt = new Date();
    await receipt.save();
    
    await receipt.populate('createdBy', 'name email');
    await receipt.populate('validatedBy', 'name email');
    
    res.json({ message: "Receipt validated and stock updated", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCEL receipt
export const cancelReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    
    if (receipt.status === "DONE") {
      return res.status(400).json({ error: "Cannot cancel validated receipts" });
    }
    
    receipt.status = "CANCELLED";
    await receipt.save();
    
    res.json({ message: "Receipt cancelled", receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE receipt
export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    
    if (receipt.status === "DONE") {
      return res.status(400).json({ error: "Cannot delete validated receipts" });
    }
    
    await receipt.deleteOne();
    res.json({ message: "Receipt deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET statistics
export const getReceiptStatistics = async (req, res) => {
  try {
    const total = await Receipt.countDocuments();
    const pending = await Receipt.countDocuments({ status: { $in: ["DRAFT", "WAITING", "READY"] } });
    const done = await Receipt.countDocuments({ status: "DONE" });
    
    res.json({ total, pending, done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};