import mongoose from "mongoose";
import dotenv from "dotenv";
import MoveHistory from "./models/MoveHistory.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedMoves = async () => {
  try {
    // Get some products
    const products = await Product.find().limit(5);
    const user = await User.findOne();
    
    if (!products.length || !user) {
      console.log("❌ Need products and user first. Run seedProducts.js first.");
      process.exit(1);
    }
    
    await MoveHistory.deleteMany();
    
    const moves = [
      {
        product: products[0]._id,
        type: "RECEIPT",
        quantity: 100,
        toLocation: "WH/Stock1",
        reference: "WH/PUR/0001",
        contact: "Asus Infonet",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-20")
      },
      {
        product: products[0]._id,
        type: "TRANSFER",
        quantity: 50,
        fromLocation: "WH/Stock1",
        toLocation: "WH/Stock2",
        reference: "WH/INT/0001",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-21")
      },
      {
        product: products[0]._id,
        type: "DELIVERY",
        quantity: 20,
        fromLocation: "WH/Stock2",
        toLocation: "Customer",
        reference: "WH/OUT/0001",
        contact: "ABC Corp",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-22")
      },
      {
        product: products[0]._id,
        type: "ADJUSTMENT",
        quantity: -3,
        fromLocation: "WH/Stock1",
        reference: "WH/ADJ/0001",
        note: "Damaged items removed",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-22")
      },
      {
        product: products[1]._id,
        type: "RECEIPT",
        quantity: 50,
        toLocation: "WH/Stock1",
        reference: "WH/PUR/0002",
        contact: "Tech Supplies Ltd",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-19")
      },
      {
        product: products[1]._id,
        type: "DELIVERY",
        quantity: 25,
        fromLocation: "WH/Stock1",
        toLocation: "Customer",
        reference: "WH/OUT/0002",
        contact: "XYZ Industries",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-23")
      },
      {
        product: products[2]._id,
        type: "RECEIPT",
        quantity: 200,
        toLocation: "WH/Stock2",
        reference: "WH/PUR/0003",
        contact: "Office Mart",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-18")
      },
      {
        product: products[3]._id,
        type: "TRANSFER",
        quantity: 30,
        fromLocation: "WH/Stock1",
        toLocation: "Production Area",
        reference: "WH/INT/0002",
        status: "DONE",
        user: user._id,
        createdAt: new Date("2025-11-22")
      }
    ];
    
    const inserted = await MoveHistory.insertMany(moves);
    console.log(`✅ Successfully imported ${inserted.length} move history records!`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding move history:", error);
    process.exit(1);
  }
};

mongoose.connection.once('open', () => {
  console.log("✅ MongoDB Connected");
  seedMoves();
});