import Stock from "../models/Stock.js";
import StockLedger from "../models/StockLedger.js";

// 📌 Get stock summary
export const getAllStock = async (req, res) => {
  const stock = await Stock.find().populate("product warehouse");
  res.json(stock);
};

// 📌 Receipt (Increase Stock)
export const addReceipt = async (req, res) => {
  const { product, warehouse, quantity } = req.body;

  let stock = await Stock.findOne({ product, warehouse });
  if (!stock) stock = await Stock.create({ product, warehouse, quantity: 0 });

  const prev = stock.quantity;
  stock.quantity += quantity;
  await stock.save();

  await StockLedger.create({
    product, warehouse, type: "RECEIPT", reference: "Vendor",
    previousQuantity: prev, newQuantity: stock.quantity, quantity,
    user: req.user.id
  });

  res.json({ message: "Stock received successfully", stock });
};

// 📌 Delivery (Decrease Stock)
export const addDelivery = async (req, res) => {
  const { product, warehouse, quantity } = req.body;

  const stock = await Stock.findOne({ product, warehouse });
  if (!stock || stock.quantity < quantity)
    return res.json({ error: "Not enough stock" });

  const prev = stock.quantity;
  stock.quantity -= quantity;
  await stock.save();

  await StockLedger.create({
    product, warehouse, type: "DELIVERY", reference: "Sales",
    previousQuantity: prev, newQuantity: stock.quantity, quantity: -quantity,
    user: req.user.id
  });

  res.json({ message: "Delivery completed", stock });
};

// 📌 Internal Transfer (Warehouse to Warehouse)
export const transferStock = async (req, res) => {
  const { product, fromWarehouse, toWarehouse, quantity } = req.body;

  const source = await Stock.findOne({ product, warehouse: fromWarehouse });
  if (!source || source.quantity < quantity)
    return res.json({ error: "Not enough stock in source" });

  source.quantity -= quantity;
  await source.save();

  let destination = await Stock.findOne({ product, warehouse: toWarehouse });
  if (!destination) destination = await Stock.create({ product, warehouse: toWarehouse, quantity: 0 });

  destination.quantity += quantity;
  await destination.save();

  await StockLedger.create({
    product, warehouse: fromWarehouse, type: "TRANSFER",
    reference: `To: ${toWarehouse}`, previousQuantity: source.quantity + quantity,
    newQuantity: source.quantity, quantity: -quantity, user: req.user.id
  });

  res.json({ message: "Transferred successfully" });
};

// 📌 Stock Adjustment
export const adjustStock = async (req, res) => {
  const { product, warehouse, counted } = req.body;

  const stock = await Stock.findOne({ product, warehouse });
  if (!stock) return res.json({ error: "Stock not found" });

  const diff = counted - stock.quantity;
  const prev = stock.quantity;
  stock.quantity = counted;
  await stock.save();

  await StockLedger.create({
    product, warehouse, type: "ADJUSTMENT",
    previousQuantity: prev, newQuantity: counted, quantity: diff,
    user: req.user.id
  });

  res.json({ message: "Stock adjusted", stock });
};
