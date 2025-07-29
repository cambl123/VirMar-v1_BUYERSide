// server.js or app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./configs/mongo.connect.js";
import { initSocketServer } from "./sockets/sockets.js"; // ✅ adjust the path as needed

// Load env variables
dotenv.config();

// Express app
const app = express();
const server = http.createServer(app); // HTTP server for socket.io

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Route imports
import sellerRoutes from "./routes/seller.routes.js";
import buyerRoutes from "./routes/buyer.routes.js";
import publicRoutes from "./routes/public.routes.js";
import escrowRoutes from "./routes/escrow.routes.js";
import transactRoutes from "./routes/transact.routes.js";

// Routes
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/escrow", escrowRoutes);
app.use('/api/transaction',transactRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Initialize socket.io server
initSocketServer(server);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// stay tuned to my channel to see the sample frontend i build with ai i will rebuild it understanding the concepts if you can help i will send the code ....bye

// Extended feature routes
// import transactRoutes from "./routes/transact.routes.js";
// import orderRoutes from "./routes/order.routes.js";
// import reviewRoutes from "./routes/review.routes.js";
// import inventoryRoutes from "./routes/inventory.routes.js";
// import analyticsRoutes from "./routes/analytics.routes.js";
// import shippingRoutes from "./routes/shipping.routes.js";

// Optional middleware (imported but unused)
// import protectBuyerRoute from "./configs/middleware/potect.buyerRoute.js";

// app.use("/api/transactions", transactRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/shipping", shippingRoutes);

// Global error handler
