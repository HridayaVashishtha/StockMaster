import Adjustment from '../models/Adjustment.js';
import Product from '../models/Product.js';

// @desc    Get all adjustments
// @route   GET /api/adjustments
// @access  Private
export const getAdjustments = async (req, res) => {
  try {
    const adjustments = await Adjustment.find({ user: req.userId })
      .populate('product', 'name internalReference')
      .populate('fromWarehouse', 'name shortCode')
      .populate('toWarehouse', 'name shortCode')
      .populate('fromLocation', 'name shortCode')
      .populate('toLocation', 'name shortCode')
      .sort({ createdAt: -1 });
    
    res.json(adjustments);
  } catch (error) {
    console.error('Error in getAdjustments:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single adjustment
// @route   GET /api/adjustments/:id
// @access  Private
export const getAdjustmentById = async (req, res) => {
  try {
    const adjustment = await Adjustment.findOne({
      _id: req.params.id,
      user: req.userId
    })
      .populate('product', 'name internalReference')
      .populate('fromWarehouse', 'name shortCode')
      .populate('toWarehouse', 'name shortCode')
      .populate('fromLocation', 'name shortCode')
      .populate('toLocation', 'name shortCode');

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    res.json(adjustment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new adjustment
// @route   POST /api/adjustments
// @access  Private
export const createAdjustment = async (req, res) => {
  try {
    const { product, quantity, fromWarehouse, toWarehouse, fromLocation, toLocation, reason } = req.body;

    // Validate warehouses are different
    if (fromWarehouse === toWarehouse) {
      return res.status(400).json({ message: 'Source and destination warehouses must be different' });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product has enough stock
    if (productExists.quantityOnHand < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${productExists.quantityOnHand}, Requested: ${quantity}` 
      });
    }

    const adjustment = await Adjustment.create({
      product,
      quantity,
      fromWarehouse,
      toWarehouse,
      fromLocation: fromLocation || undefined,
      toLocation: toLocation || undefined,
      reason,
      user: req.userId
    });

    const populatedAdjustment = await Adjustment.findById(adjustment._id)
      .populate('product', 'name internalReference')
      .populate('fromWarehouse', 'name shortCode')
      .populate('toWarehouse', 'name shortCode')
      .populate('fromLocation', 'name shortCode')
      .populate('toLocation', 'name shortCode');

    res.status(201).json(populatedAdjustment);
  } catch (error) {
    console.error('Error in createAdjustment:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update adjustment
// @route   PUT /api/adjustments/:id
// @access  Private
export const updateAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    const { product, quantity, fromWarehouse, toWarehouse, fromLocation, toLocation, reason } = req.body;

    // Validate warehouses are different
    if (fromWarehouse === toWarehouse) {
      return res.status(400).json({ message: 'Source and destination warehouses must be different' });
    }

    adjustment.product = product || adjustment.product;
    adjustment.quantity = quantity || adjustment.quantity;
    adjustment.fromWarehouse = fromWarehouse || adjustment.fromWarehouse;
    adjustment.toWarehouse = toWarehouse || adjustment.toWarehouse;
    adjustment.fromLocation = fromLocation || adjustment.fromLocation;
    adjustment.toLocation = toLocation || adjustment.toLocation;
    adjustment.reason = reason !== undefined ? reason : adjustment.reason;

    const updatedAdjustment = await adjustment.save();
    
    const populatedAdjustment = await Adjustment.findById(updatedAdjustment._id)
      .populate('product', 'name internalReference')
      .populate('fromWarehouse', 'name shortCode')
      .populate('toWarehouse', 'name shortCode')
      .populate('fromLocation', 'name shortCode')
      .populate('toLocation', 'name shortCode');

    res.json(populatedAdjustment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete adjustment
// @route   DELETE /api/adjustments/:id
// @access  Private
export const deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await Adjustment.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!adjustment) {
      return res.status(404).json({ message: 'Adjustment not found' });
    }

    await adjustment.deleteOne();
    res.json({ message: 'Adjustment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};