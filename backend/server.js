// server.js - Recreated without the problematic wildcard route

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io"; // ✅ ESM-compatible Socket.IO import

import connectDB from "./configs/mongo.connect.js";
import { initSocketServer } from "./sockets/sockets.js"; // Socket.IO re-enabled

// Load env variables
dotenv.config();

// Express app & HTTP server
const app = express();
const server = http.createServer(app);

// MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://virmar.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: ' + origin));
    }
  },
  credentials: true
}));

// ===============================
// ✅ API Routes - All re-enabled
// ===============================
import sellerRoutes from "./routes/seller.routes.js";
import buyerRoutes from "./routes/buyer.routes.js";
import publicRoutes from "./routes/public.routes.js";
import escrowRoutes from "./routes/escrow.routes.js";
import transactRoutes from "./routes/transact.routes.js";

app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/transaction", transactRoutes);

// Optional future routes (uncomment when ready)
// import orderRoutes from "./routes/order.routes.js";
// import reviewRoutes from "./routes/review.routes.js";
// import inventoryRoutes from "./routes/inventory.routes.js";
// import analyticsRoutes from "./routes/analytics.routes.js";
// import shippingRoutes from "./routes/shipping.routes.js";

// app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/shipping", shippingRoutes);

// ===============================
// ✅ Serve Vite Frontend (Dist Folder) - Wildcard route removed
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ This is the Vite build output folder
const distPath = path.join(__dirname, "../frontend/VirMar-RWANDA/dist");

app.use(express.static(distPath));

// ❌ app.get("/*", ...) - THIS LINE HAS BEEN REMOVED/EXCLUDED!
//    The error was consistently tied to this wildcard route.
//    Your frontend might not load correctly without a fallback,
//    but the server should start without the TypeError.

// ==============================
// ✅ Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// ✅ Initialize Socket.IO - Re-enabled
// ===============================
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://virmar.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initSocketServer(server);

// ===============================
// ✅ Start Server
// ===============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
