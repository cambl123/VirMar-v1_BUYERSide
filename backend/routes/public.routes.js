// routes/public.routes.js

import express from "express";
import Seller from "../models/sellers.model.js";
import Item from "../models/items.model.js";
// import publicRouter from "../configs/middleware/protectRoutes.js"; // You might remove this if it's unused
import protectRoutes from "../configs/middleware/protectRoutes.js";

const publicRouter = express.Router();

publicRouter.get("/", async (req, res) => {
  try {
    // 🔹 Get active sellers and exclude sensitive fields
    const sellers = await Seller.find({ isActive: true }).select("-password -__v");

    // 🔹 Get all items with populated price and store data
    const items = await Item.find({})
      .populate("price")
      .populate("store_id")
      .select("-__v");

    // 🔹 Format the products to match frontend expectations
    const formattedProducts = items.map((item) => {
      let priceAmount = 0;
      let priceLabel = "₣0";

      if (item.price) {
        if (typeof item.price === "object") {
          priceAmount = item.price.amount ?? 0;
          priceLabel = `₣${priceAmount}`;
        } else if (typeof item.price === "number") {
          priceAmount = item.price;
          priceLabel = `₣${priceAmount}`;
        } else if (typeof item.price === "string") {
          const num = item.price.replace(/[^\d]/g, "");
          priceAmount = num ? parseInt(num, 10) : 0;
          priceLabel = item.price.startsWith("₣") ? item.price : `₣${priceAmount}`;
        }
      }

      return {
        _id: item._id,
        name: item.name,
        price: priceAmount,
        priceLabel,
        category:  "Uncategorized",
        location:  "Unknown",
        available: item.status === "available",
        quantity: item.quantity ?? 0,
        img: item.img || "/products/default.png",
      };
    });

    return res.status(200).json({
      sellers,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching public marketplace data:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// export default router;


// Authenticated /Info route
publicRouter.get("/Info", protectRoutes, async (req, res) => {
  const { role } = req.user;
  try {
    if (role === "buyer") {
      // Logic for buyer-specific info
      return res.status(200).json({ message: "You are a buyer" });
    } else if (role === "seller") {
      // Logic for seller-specific info
      return res.status(200).json({ message: "You are a seller" });
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }
  } catch (error) {
    console.error("Error in /Info route:", error);
    res.status(500).json({ message: error.message });
  }
});

export default publicRouter;
