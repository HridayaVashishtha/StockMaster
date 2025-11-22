import Warehouse from "../models/Warehouse.js";
import Location from "../models/Location.js";

export const createWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;
    
    if (!name || !shortCode) {
      return res.status(400).json({ error: "Name and Short Code are required" });
    }

    const existing = await Warehouse.findOne({ 
      $or: [{ name }, { shortCode }] 
    });

    if (existing) {
      return res.status(400).json({ 
        error: existing.name === name 
          ? "Warehouse name already exists" 
          : "Short code already exists" 
      });
    }

    const warehouse = await Warehouse.create({ name, shortCode, address });
    res.status(201).json({ message: "Warehouse created successfully", warehouse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    
    const locations = await Location.find({ warehouse: warehouse._id, isActive: true });
    res.json({ warehouse, locations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { name, shortCode, address },
      { new: true, runValidators: true }
    );
    
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    
    res.json({ message: "Warehouse updated successfully", warehouse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    
    // Also deactivate associated locations
    await Location.updateMany(
      { warehouse: warehouse._id },
      { isActive: false }
    );
    
    res.json({ message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
