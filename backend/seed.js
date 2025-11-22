import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Warehouse from './models/Warehouse.js';
import Location from './models/Location.js';
import Adjustment from './models/Adjustment.js';
import Stock from './models/Stock.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Warehouse.deleteMany({});
    await Location.deleteMany({});
    await Adjustment.deleteMany({});
    await Stock.deleteMany({});

    console.log('Data cleared');

    // Create user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
    });

    console.log('User created:', user.email);

    // Create warehouses
    const warehouses = await Warehouse.insertMany([
      {
        name: 'Main Warehouse',
        code: 'WH-MAIN',
        shortCode: 'MAIN',
        address: '123 Main Street, City, Country',
        user: user._id,
      },
      {
        name: 'Secondary Warehouse',
        code: 'WH-SEC',
        shortCode: 'SEC',
        address: '456 Secondary Ave, City, Country',
        user: user._id,
      },
      {
        name: 'Distribution Center',
        code: 'WH-DIST',
        shortCode: 'DIST',
        address: '789 Distribution Blvd, City, Country',
        user: user._id,
      },
    ]);

    console.log('Warehouses created:', warehouses.length);

    // Create locations for each warehouse
    const locations = [];

    // Main Warehouse locations
    locations.push(
      {
        name: 'Receiving Area',
        shortCode: 'WH-MAIN-RCV',
        warehouse: warehouses[0]._id,
        user: user._id,
      },
      {
        name: 'Storage Zone A',
        shortCode: 'WH-MAIN-A',
        warehouse: warehouses[0]._id,
        user: user._id,
      },
      {
        name: 'Storage Zone B',
        shortCode: 'WH-MAIN-B',
        warehouse: warehouses[0]._id,
        user: user._id,
      },
      {
        name: 'Shipping Area',
        shortCode: 'WH-MAIN-SHIP',
        warehouse: warehouses[0]._id,
        user: user._id,
      },
    );

    // Secondary Warehouse locations
    locations.push(
      {
        name: 'Receiving Dock',
        shortCode: 'WH-SEC-RCV',
        warehouse: warehouses[1]._id,
        user: user._id,
      },
      {
        name: 'Shelf 1-A',
        shortCode: 'WH-SEC-1A',
        warehouse: warehouses[1]._id,
        user: user._id,
      },
      {
        name: 'Shelf 1-B',
        shortCode: 'WH-SEC-1B',
        warehouse: warehouses[1]._id,
        user: user._id,
      },
    );

    // Distribution Center locations
    locations.push(
      {
        name: 'Inbound Area',
        shortCode: 'WH-DIST-IN',
        warehouse: warehouses[2]._id,
        user: user._id,
      },
      {
        name: 'Outbound Area',
        shortCode: 'WH-DIST-OUT',
        warehouse: warehouses[2]._id,
        user: user._id,
      },
      {
        name: 'Transit Zone',
        shortCode: 'WH-DIST-TRANSIT',
        warehouse: warehouses[2]._id,
        user: user._id,
      },
    );

    const createdLocations = await Location.insertMany(locations);
    console.log('Locations created:', createdLocations.length);

    // Create products (matching seedProducts.js schema)
    const products = await Product.insertMany([
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
      }
    ]);

    console.log('Products created:', products.length);

    // Create Stock entries for each product in each warehouse
    const stockEntries = [];
    products.forEach((product, idx) => {
      // Distribute stock across warehouses
      const totalStock = product.onHand;
      const mainWarehouseStock = Math.floor(totalStock * 0.6);
      const secWarehouseStock = Math.floor(totalStock * 0.3);
      const distCenterStock = totalStock - mainWarehouseStock - secWarehouseStock;

      stockEntries.push({
        product: product._id,
        warehouse: warehouses[0]._id,
        quantity: mainWarehouseStock
      });

      if (secWarehouseStock > 0) {
        stockEntries.push({
          product: product._id,
          warehouse: warehouses[1]._id,
          quantity: secWarehouseStock
        });
      }

      if (distCenterStock > 0) {
        stockEntries.push({
          product: product._id,
          warehouse: warehouses[2]._id,
          quantity: distCenterStock
        });
      }
    });

    await Stock.insertMany(stockEntries);
    console.log('Stock entries created:', stockEntries.length);

    // Create sample adjustments
    const adjustments = await Adjustment.insertMany([
      {
        product: products[0]._id,
        quantity: 5,
        fromWarehouse: warehouses[0]._id,
        toWarehouse: warehouses[1]._id,
        fromLocation: createdLocations[1]._id,
        toLocation: createdLocations[4]._id,
        reason: 'Rebalancing stock between main and secondary warehouse',
        user: user._id,
      },
      {
        product: products[3]._id,
        quantity: 10,
        fromWarehouse: warehouses[0]._id,
        toWarehouse: warehouses[2]._id,
        fromLocation: createdLocations[2]._id,
        toLocation: createdLocations[7]._id,
        reason: 'Transfer to distribution center for bulk orders',
        user: user._id,
      },
      {
        product: products[2]._id,
        quantity: 3,
        fromWarehouse: warehouses[1]._id,
        toWarehouse: warehouses[0]._id,
        fromLocation: createdLocations[5]._id,
        toLocation: createdLocations[0]._id,
        reason: 'Consolidating inventory to main warehouse',
        user: user._id,
      }
    ]);

    console.log('Adjustments created:', adjustments.length);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    console.log('\nData Summary:');
    console.log('- Warehouses:', warehouses.length);
    console.log('- Locations:', createdLocations.length);
    console.log('- Products:', products.length);
    console.log('- Stock entries:', stockEntries.length);
    console.log('- Adjustments:', adjustments.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();