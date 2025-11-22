import Location from '../models/Location.js';

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ user: req.userId })
      .populate('warehouse', 'name shortCode')
      .sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    console.error('Error in getLocations:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate('warehouse', 'name shortCode');

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new location
// @route   POST /api/locations
// @access  Private
export const createLocation = async (req, res) => {
  try {
    const { name, shortCode, warehouse } = req.body;

    const location = await Location.create({
      name,
      shortCode,
      warehouse,
      user: req.userId
    });

    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const { name, shortCode, warehouse } = req.body;

    location.name = name || location.name;
    location.shortCode = shortCode || location.shortCode;
    location.warehouse = warehouse || location.warehouse;

    const updatedLocation = await location.save();
    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await location.deleteOne();
    res.json({ message: 'Location removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};