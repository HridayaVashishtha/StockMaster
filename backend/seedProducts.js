import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedProducts = [
  {
    name: "Office Desk",
    sku: "FURN-001",
    costPerUnit: 5500,
    onHand: 45,
    freeToUse: 42,
    category: "Furniture",
    unit: "pcs"
  },
  {
    name: "Ergonomic Chair",
    sku: "FURN-002",
    costPerUnit: 3200,
    onHand: 28,
    freeToUse: 25,
    category: "Furniture",
    unit: "pcs"
  },
  {
    name: "LED Monitor 24\"",
    sku: "ELEC-001",
    costPerUnit: 8500,
    onHand: 15,
    freeToUse: 12,
    category: "Electronics",
    unit: "pcs"
  },
  {
    name: "Wireless Mouse",
    sku: "ELEC-002",
    costPerUnit: 450,
    onHand: 120,
    freeToUse: 115,
    category: "Electronics",
    unit: "pcs"
  },
  {
    name: "Mechanical Keyboard",
    sku: "ELEC-003",
    costPerUnit: 2800,
    onHand: 8,
    freeToUse: 5,
    category: "Electronics",
    unit: "pcs"
  },
  {
    name: "A4 Paper Ream",
    sku: "STAT-001",
    costPerUnit: 280,
    onHand: 250,
    freeToUse: 240,
    category: "Stationery",
    unit: "boxes"
  },
  {
    name: "Whiteboard Marker",
    sku: "STAT-002",
    costPerUnit: 35,
    onHand: 6,
    freeToUse: 6,
    category: "Stationery",
    unit: "pcs"
  },
  {
    name: "Steel Filing Cabinet",
    sku: "FURN-003",
    costPerUnit: 6500,
    onHand: 12,
    freeToUse: 10,
    category: "Furniture",
    unit: "pcs"
  },
  {
    name: "Printer Cartridge (Black)",
    sku: "ELEC-004",
    costPerUnit: 1850,
    onHand: 4,
    freeToUse: 3,
    category: "Electronics",
    unit: "pcs"
  },
  {
    name: "Conference Table",
    sku: "FURN-004",
    costPerUnit: 18500,
    onHand: 3,
    freeToUse: 2,
    category: "Furniture",
    unit: "pcs"
  },
  {
    name: "Steel Rods (10mm)",
    sku: "RAW-001",
    costPerUnit: 65,
    onHand: 1500,
    freeToUse: 1450,
    category: "Raw Materials",
    unit: "kg"
  },
  {
    name: "Hydraulic Oil",
    sku: "RAW-002",
    costPerUnit: 320,
    onHand: 85,
    freeToUse: 80,
    category: "Raw Materials",
    unit: "liters"
  },
  {
    name: "Packaging Boxes (Large)",
    sku: "PACK-001",
    costPerUnit: 45,
    onHand: 9,
    freeToUse: 8,
    category: "Packaging",
    unit: "boxes"
  },
  {
    name: "Safety Helmet",
    sku: "SAFE-001",
    costPerUnit: 380,
    onHand: 55,
    freeToUse: 50,
    category: "Safety Equipment",
    unit: "pcs"
  },
  {
    name: "Pallet Jack",
    sku: "EQUIP-001",
    costPerUnit: 12500,
    onHand: 5,
    freeToUse: 4,
    category: "Equipment",
    unit: "pcs"
  }
];

const importData = async () => {
  try {
    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany();
    
    console.log("📦 Inserting new products...");
    const inserted = await Product.insertMany(seedProducts);
    
    console.log(`✅ Successfully imported ${inserted.length} products!`);
    
    // Verify
    const count = await Product.countDocuments();
    console.log(`📊 Total products in DB: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

// Wait for DB connection
mongoose.connection.once('open', () => {
  console.log("✅ MongoDB Connected");
  importData();
});