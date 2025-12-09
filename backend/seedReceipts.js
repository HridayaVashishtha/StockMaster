import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Receipt from "./models/Receipt.js";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();
connectDB();

const seedReceipts = async () => {
  try {
    const emailArg = process.env.SEED_USER_EMAIL || process.argv[2] || null;

    const products = await Product.find({}, { _id: 1 }).lean();
    const productIds = products.map(p => p._id);
    const user = emailArg
      ? await User.findOne({ email: emailArg }).lean()
      : await User.findOne().lean();

    console.log(`Products found: ${productIds.length}`);
    console.log(`Seeding for: ${user ? user.email : "NO USER"}`);

    if (productIds.length === 0) {
      console.error("❌ No products found. Seed products first, then re-run.");
      process.exit(1);
    }
    if (!user) {
      console.error("❌ No user found. Pass an email: node seedReceipts.js your@email.com");
      process.exit(1);
    }

    const pid = (i) => productIds[i % productIds.length];

    await Receipt.deleteMany();

    const receipts = [
      {
        reference: "WH/IN/0001",
        supplier: "Asus Infonet",
        items: [{ product: pid(0), quantityExpected: 50, quantityReceived: 45 }],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Rajesh Kumar",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date(),
        note: "Partial delivery"
      },
      {
        reference: "WH/IN/0002",
        supplier: "Tech Supplies Ltd",
        items: [{ product: pid(1), quantityExpected: 120, quantityReceived: 120 }],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Priya Sharma",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date()
      },
      {
        reference: "WH/IN/0003",
        supplier: "Office Mart",
        items: [
          { product: pid(2), quantityExpected: 250, quantityReceived: 250 },
          { product: pid(3), quantityExpected: 50, quantityReceived: 48 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Amit Patel",
        status: "READY",
        note: "Awaiting inspection"
      },
      {
        reference: "WH/IN/0004",
        supplier: "Steel Corporation Ltd",
        items: [{ product: pid(4), quantityExpected: 1500, quantityReceived: 0 }],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Vikram Singh",
        status: "READY"
      },
      {
        reference: "WH/IN/0005",
        supplier: "Industrial Supplies Co",
        items: [
          { product: pid(5), quantityExpected: 100, quantityReceived: 0 },
          { product: pid(6), quantityExpected: 60, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Sunita Desai",
        status: "DRAFT"
      },
      {
        reference: "WH/IN/0006",
        supplier: "Unreliable Suppliers Ltd",
        items: [{ product: pid(7), quantityExpected: 50, quantityReceived: 0 }],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Ravi Sharma",
        status: "CANCELLED",
        note: "Cancelled"
      }
    ];

    // ensure user for API filter
    receipts.forEach(r => { r.user = user._id; });

    const inserted = await Receipt.insertMany(receipts);
    console.log(`✅ Imported ${inserted.length} receipts for ${user.email}`);

    const summary = await Receipt.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
    console.log("📊 Summary:", summary);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding receipts:", error);
    process.exit(1);
  }
};

mongoose.connection.once("open", () => {
  console.log("✅ MongoDB Connected");
  seedReceipts();
});