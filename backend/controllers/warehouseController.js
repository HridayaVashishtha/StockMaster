import Warehouse from "../models/Warehouse.js";

export const createWarehouse = async (req, res) => {
  const warehouse = await Warehouse.create(req.body);
  res.json(warehouse);
};

export const getWarehouses = async (req, res) => {
  res.json(await Warehouse.find());
};
