import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import moveHistoryRoutes from "./routes/moveHistoryRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/move-history", moveHistoryRoutes);
app.use("/api/receipts", receiptRoutes);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
