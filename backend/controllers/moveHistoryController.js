import MoveHistory from "../models/MoveHistory.js";
import Product from "../models/Product.js";

// GET all move history with filters
export const getAllMoveHistory = async (req, res) => {
  try {
    const { type, status, product, fromDate, toDate, search } = req.query;
    
    let filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (product) filter.product = product;
    
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }
    
    if (search) {
      filter.$or = [
        { reference: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { fromLocation: { $regex: search, $options: 'i' } },
        { toLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const moves = await MoveHistory.find(filter)
      .populate('product', 'name sku unit')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(500);
    
    res.json(moves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET move history for specific product
export const getProductMoveHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const moves = await MoveHistory.find({ product: productId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(moves);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE new move (used by stock operations)
export const createMove = async (req, res) => {
  try {
    const { 
      productId, 
      type, 
      quantity, 
      fromLocation, 
      toLocation, 
      reference,
      contact,
      note 
    } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    const move = await MoveHistory.create({
      product: productId,
      type,
      quantity,
      fromLocation,
      toLocation,
      reference,
      contact,
      note,
      status: "DONE",
      user: req.userId
    });
    
    await move.populate('product', 'name sku unit');
    await move.populate('user', 'name email');
    
    res.status(201).json({ message: "Move created", move });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET statistics
export const getMoveStatistics = async (req, res) => {
  try {
    const totalMoves = await MoveHistory.countDocuments();
    const receiptCount = await MoveHistory.countDocuments({ type: "RECEIPT" });
    const deliveryCount = await MoveHistory.countDocuments({ type: "DELIVERY" });
    const transferCount = await MoveHistory.countDocuments({ type: "TRANSFER" });
    const adjustmentCount = await MoveHistory.countDocuments({ type: "ADJUSTMENT" });
    
    const recentMoves = await MoveHistory.find()
      .populate('product', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      total: totalMoves,
      byType: {
        receipt: receiptCount,
        delivery: deliveryCount,
        transfer: transferCount,
        adjustment: adjustmentCount
      },
      recent: recentMoves
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};