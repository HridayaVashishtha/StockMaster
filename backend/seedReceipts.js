import mongoose from "mongoose";
import dotenv from "dotenv";
import Receipt from "./models/Receipt.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const seedReceipts = async () => {
  try {
    const products = await Product.find();
    const user = await User.findOne();
    
    if (!products.length || !user) {
      console.log("❌ Need products and user first.");
      process.exit(1);
    }
    
    await Receipt.deleteMany();
    
    const receipts = [
      // DONE - Already validated receipts (stock already added)
      {
        reference: "WH/IN/0001",
        supplier: "Asus Infonet",
        items: [
          { product: products[0]._id, quantityExpected: 50, quantityReceived: 45 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Rajesh Kumar",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-15T10:30:00"),
        createdAt: new Date("2025-11-15T08:00:00"),
        note: "Partial delivery - 5 items damaged in transit"
      },
      {
        reference: "WH/IN/0002",
        supplier: "Tech Supplies Ltd",
        items: [
          { product: products[3]._id, quantityExpected: 120, quantityReceived: 120 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Priya Sharma",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-16T14:20:00"),
        createdAt: new Date("2025-11-16T09:00:00")
      },
      {
        reference: "WH/IN/0003",
        supplier: "Office Mart",
        items: [
          { product: products[5]._id, quantityExpected: 250, quantityReceived: 250 },
          { product: products[6]._id, quantityExpected: 50, quantityReceived: 48 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Amit Patel",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-17T11:45:00"),
        createdAt: new Date("2025-11-17T07:30:00"),
        note: "2 marker packs missing"
      },
      {
        reference: "WH/IN/0004",
        supplier: "Steel Corporation Ltd",
        items: [
          { product: products[10]._id, quantityExpected: 1500, quantityReceived: 1500 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Vikram Singh",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-18T16:00:00"),
        createdAt: new Date("2025-11-18T08:00:00"),
        note: "Quality checked - all items passed"
      },
      {
        reference: "WH/IN/0005",
        supplier: "Industrial Supplies Co",
        items: [
          { product: products[11]._id, quantityExpected: 100, quantityReceived: 85 },
          { product: products[13]._id, quantityExpected: 60, quantityReceived: 55 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Sunita Desai",
        status: "DONE",
        createdBy: user._id,
        validatedBy: user._id,
        validatedAt: new Date("2025-11-19T13:30:00"),
        createdAt: new Date("2025-11-19T09:00:00"),
        note: "Short delivery - supplier to send remaining next week"
      },
      
      // READY - Items arrived, waiting for quality check
      {
        reference: "WH/IN/0006",
        supplier: "Azure Interior",
        items: [
          { product: products[1]._id, quantityExpected: 30, quantityReceived: 0 },
          { product: products[7]._id, quantityExpected: 15, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Rahul Mehta",
        status: "READY",
        scheduleDate: new Date("2025-11-22T09:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-20T10:00:00"),
        note: "Items at receiving dock - awaiting inspection"
      },
      {
        reference: "WH/IN/0007",
        supplier: "Electronics Hub",
        items: [
          { product: products[2]._id, quantityExpected: 20, quantityReceived: 0 },
          { product: products[4]._id, quantityExpected: 10, quantityReceived: 0 },
          { product: products[8]._id, quantityExpected: 8, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Neha Gupta",
        status: "READY",
        scheduleDate: new Date("2025-11-23T10:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-21T14:00:00"),
        note: "High value items - careful inspection required"
      },
      
      // WAITING - Scheduled for future delivery
      {
        reference: "WH/IN/0008",
        supplier: "Tech Supplies Ltd",
        items: [
          { product: products[4]._id, quantityExpected: 15, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Arjun Reddy",
        status: "WAITING",
        scheduleDate: new Date("2025-11-25T11:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-21T16:00:00"),
        note: "Expected delivery on 25th Nov"
      },
      {
        reference: "WH/IN/0009",
        supplier: "Packaging Solutions",
        items: [
          { product: products[12]._id, quantityExpected: 500, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Kavya Iyer",
        status: "WAITING",
        scheduleDate: new Date("2025-11-26T09:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T08:00:00"),
        note: "Bulk order - coordinate with logistics team"
      },
      {
        reference: "WH/IN/0010",
        supplier: "Furniture Depot",
        items: [
          { product: products[9]._id, quantityExpected: 5, quantityReceived: 0 },
          { product: products[0]._id, quantityExpected: 25, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Deepak Joshi",
        status: "WAITING",
        scheduleDate: new Date("2025-11-27T14:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T10:00:00"),
        note: "Large items - arrange forklift"
      },
      
      // DRAFT - Purchase orders created but not confirmed
      {
        reference: "WH/IN/0011",
        supplier: "Safety First Equipment",
        items: [
          { product: products[13]._id, quantityExpected: 100, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Manish Agarwal",
        status: "DRAFT",
        scheduleDate: new Date("2025-11-28T10:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T11:00:00"),
        note: "Awaiting purchase approval"
      },
      {
        reference: "WH/IN/0012",
        supplier: "Industrial Tools Inc",
        items: [
          { product: products[14]._id, quantityExpected: 8, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Sanjay Kumar",
        status: "DRAFT",
        scheduleDate: new Date("2025-11-30T09:00:00"),
        createdBy: user._id,
        createdAt: new Date("2025-11-22T12:00:00"),
        note: "Quote received - pending manager approval"
      },
      {
        reference: "WH/IN/0013",
        supplier: "Office Mart",
        items: [
          { product: products[5]._id, quantityExpected: 300, quantityReceived: 0 },
          { product: products[6]._id, quantityExpected: 100, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Pooja Nair",
        status: "DRAFT",
        createdBy: user._id,
        createdAt: new Date("2025-11-22T13:00:00"),
        note: "Monthly stationery order - under review"
      },
      
      // CANCELLED - Orders that were cancelled
      {
        reference: "WH/IN/0014",
        supplier: "Unreliable Suppliers Ltd",
        items: [
          { product: products[2]._id, quantityExpected: 50, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock1",
        responsible: "Ravi Sharma",
        status: "CANCELLED",
        createdBy: user._id,
        createdAt: new Date("2025-11-10T10:00:00"),
        note: "Cancelled - vendor could not meet delivery timeline"
      },
      {
        reference: "WH/IN/0015",
        supplier: "Budget Electronics",
        items: [
          { product: products[4]._id, quantityExpected: 20, quantityReceived: 0 },
          { product: products[3]._id, quantityExpected: 50, quantityReceived: 0 }
        ],
        fromLocation: "Vendor",
        toLocation: "WH/Stock2",
        responsible: "Anjali Roy",
        status: "CANCELLED",
        createdBy: user._id,
        createdAt: new Date("2025-11-12T14:00:00"),
        note: "Cancelled - found better pricing from alternate vendor"
      }
    ];
    
    const inserted = await Receipt.insertMany(receipts);
    console.log(`✅ Successfully imported ${inserted.length} receipts!`);
    
    // Show summary
    const summary = await Receipt.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    console.log("\n📊 Receipt Status Summary:");
    summary.forEach(s => {
      console.log(`   ${s._id}: ${s.count}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding receipts:", error);
    process.exit(1);
  }
};

mongoose.connection.once('open', () => {
  console.log("✅ MongoDB Connected");
  seedReceipts();
});