import Receipt from '../models/Receipt.js';
import Product from '../models/Product.js';

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.userId })
      .populate('items.product', 'name sku')
      .sort({ createdAt: -1 });
    res.json(receipts);
  } catch (error) {
    console.error('Error in getReceipts:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single receipt
// @route   GET /api/receipts/:id
// @access  Private
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('items.product', 'name sku');

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    console.error('Error in getReceiptById:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new receipt
// @route   POST /api/receipts
// @access  Private
export const createReceipt = async (req, res) => {
  try {
    const { supplier, toLocation, scheduleDate, responsible, items } = req.body;

    if (!supplier || !items || items.length === 0) {
      return res.status(400).json({ error: 'Supplier and items are required' });
    }

    // Generate reference number
    const count = await Receipt.countDocuments();
    const reference = `REC-${String(count + 1).padStart(5, '0')}`;

    const receipt = await Receipt.create({
      reference,
      supplier,
      fromLocation: 'Vendors',
      toLocation: toLocation || 'WH/Stock1',
      scheduleDate: scheduleDate || new Date(),
      responsible,
      items: items.map(item => ({
        product: item.product,
        quantityExpected: item.quantityExpected,
        quantityReceived: 0
      })),
      user: req.userId
    });

    const populatedReceipt = await Receipt.findById(receipt._id)
      .populate('items.product', 'name sku');

    res.status(201).json({ receipt: populatedReceipt });
  } catch (error) {
    console.error('Error in createReceipt:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update receipt
// @route   PUT /api/receipts/:id
// @access  Private
export const updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const { supplier, toLocation, scheduleDate, responsible, items, status } = req.body;

    if (supplier) receipt.supplier = supplier;
    if (toLocation) receipt.toLocation = toLocation;
    if (scheduleDate) receipt.scheduleDate = scheduleDate;
    if (responsible) receipt.responsible = responsible;
    if (items) receipt.items = items;
    if (status) receipt.status = status;

    const updatedReceipt = await receipt.save();
    
    const populatedReceipt = await Receipt.findById(updatedReceipt._id)
      .populate('items.product', 'name sku');

    res.json(populatedReceipt);
  } catch (error) {
    console.error('Error in updateReceipt:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete receipt
// @route   DELETE /api/receipts/:id
// @access  Private
export const deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'DONE') {
      return res.status(400).json({ error: 'Cannot delete completed receipt' });
    }

    await receipt.deleteOne();
    res.json({ message: 'Receipt removed' });
  } catch (error) {
    console.error('Error in deleteReceipt:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate receipt (mark items as received)
// @route   POST /api/receipts/:id/validate
// @access  Private
export const validateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (receipt.status === 'DONE') {
      return res.status(400).json({ error: 'Receipt already validated' });
    }

    // Update stock for each item
    for (const item of receipt.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.onHand += item.quantityReceived || item.quantityExpected;
        product.freeToUse += item.quantityReceived || item.quantityExpected;
        await product.save();
      }
      item.quantityReceived = item.quantityReceived || item.quantityExpected;
    }

    receipt.status = 'DONE';
    await receipt.save();

    const populatedReceipt = await Receipt.findById(receipt._id)
      .populate('items.product', 'name sku');

    res.json(populatedReceipt);
  } catch (error) {
    console.error('Error in validateReceipt:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get receipt statistics
// @route   GET /api/receipts/statistics
// @access  Private
export const getReceiptStatistics = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.userId });
    
    const stats = {
      total: receipts.length,
      pending: receipts.filter(r => r.status === 'READY').length,
      done: receipts.filter(r => r.status === 'DONE').length,
      lateWaiting: receipts.filter(r => 
        r.status === 'READY' && 
        r.scheduleDate && 
        new Date(r.scheduleDate) < new Date()
      ).length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error in getReceiptStatistics:', error);
    res.status(500).json({ message: error.message });
  }
};