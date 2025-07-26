import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/mongo.connect.js";

// Core route handlers
import sellerRoutes from "./routes/seller.routes.js";
import buyerRoutes from "./routes/buyer.routes.js";
import publicRoutes from "./routes/public.routes.js";

// Extended feature routes
import transactRoutes from "./routes/transact.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";

// Optional middleware (imported but unused)
import protectBuyerRoute from "./configs/middleware/potect.buyerRoute.js";

// Load environment variables
dotenv.config();

// Initialize app and port
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using existing connectDB utility

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,               // Allow cookies
}));

// Register Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/public", publicRoutes);

app.use("/api/transactions", transactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/shipping", shippingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


connectDB();
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// stay tuned to my channel to see the sample frontend i build with ai i will rebuild it understanding the concepts if you can help i will send the code ....bye