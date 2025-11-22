import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const dropIndex = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('products');
    
    // Drop the problematic sku index
    await collection.dropIndex('sku_1');
    console.log("✅ Index 'sku_1' dropped successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error dropping index:", error.message);
    process.exit(1);
  }
};

// Wait for connection
mongoose.connection.once('open', () => {
  dropIndex();
});