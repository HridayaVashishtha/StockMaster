import Product from "../models/Product.js";
import StockLedger from "../models/StockLedger.js";

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, costPerUnit, onHand, freeToUse, category, unit } = req.body;
    
    const existing = await Product.findOne({ name });
    if (existing) return res.status(400).json({ error: "Product already exists" });

    const product = await Product.create({
      name,
      costPerUnit: costPerUnit || 0,
      onHand: onHand || 0,
      freeToUse: freeToUse || onHand || 0,
      category,
      unit
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const { name, costPerUnit, onHand, freeToUse, category, unit } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) return res.status(404).json({ error: "Product not found" });

    const previousOnHand = product.onHand;
    const previousFree = product.freeToUse;

    if (name) product.name = name;
    if (costPerUnit !== undefined) product.costPerUnit = costPerUnit;
    if (onHand !== undefined) product.onHand = onHand;
    if (freeToUse !== undefined) product.freeToUse = freeToUse;
    if (category) product.category = category;
    if (unit) product.unit = unit;

    await product.save();

    // Log adjustment if stock changed
    if (onHand !== undefined && onHand !== previousOnHand) {
      await StockLedger.create({
        product: product._id,
        type: "ADJUSTMENT",
        reference: "Manual update",
        quantity: onHand - previousOnHand,
        previousQuantity: previousOnHand,
        newQuantity: onHand,
        user: req.userId
      });
    }

    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET stock history for a product
export const getProductHistory = async (req, res) => {
  try {
    const history = await StockLedger.find({ product: req.params.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BULK stock update (for existing products)
export const bulkStockUpdate = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, onHand, freeToUse }
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const results = [];
    for (const update of updates) {
      const { productId, onHand, freeToUse, warehouse } = update;
      
      const product = await Product.findById(productId);
      if (!product) {
        results.push({ productId, error: "Product not found" });
        continue;
      }

      const previousOnHand = product.onHand;
      product.onHand = onHand !== undefined ? onHand : product.onHand;
      product.freeToUse = freeToUse !== undefined ? freeToUse : product.freeToUse;
      await product.save();

      // Log in StockLedger
      await StockLedger.create({
        product: productId,
        type: "ADJUSTMENT",
        reference: "Bulk stock import",
        quantity: product.onHand - previousOnHand,
        previousQuantity: previousOnHand,
        newQuantity: product.onHand,
        user: req.userId
      });

      results.push({ productId, success: true, product });
    }

    res.json({ message: "Bulk update completed", results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add stock to existing product
export const addStockToProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Valid quantity required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.onHand += Number(quantity);
    product.freeToUse += Number(quantity);
    await product.save();

    res.json({ 
      message: "Stock added successfully", 
      product 
    });
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ error: error.message });
  }
};
