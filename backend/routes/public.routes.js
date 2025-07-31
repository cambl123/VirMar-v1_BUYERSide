// routes/public.routes.js

import express from "express";
import Seller from "../models/sellers.model.js";
import Item from "../models/items.model.js";
// import publicRouter from "../configs/middleware/protectRoutes.js"; // You might remove this if it's unused
import protectRoutes from "../configs/middleware/protectRoutes.js";

const publicRouter = express.Router();


// export default router;
publicRouter.get("/getproducts", async (req, res) => {
  try {
    // Fetch active sellers excluding sensitive fields
    const sellers = await Seller.find({ isActive: true })
      .select("-password -__v");

    // Fetch items that belong to active sellers only
    // Assuming item has a field seller_id referencing Seller
    const activeSellerIds = sellers.map((s) => s._id);

    const items = await Item.find({ seller_id: { $in: activeSellerIds } })
      .populate("price") // only if price is a referenced document, else remove
      .populate("seller_id", "-password -__v") // get seller info but exclude sensitive
      .select("-__v");

    // Format products for frontend
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
        category: item.category || "Uncategorized",
        location: item.location || "Unknown",
        available: item.status === "available",
        quantity: item.quantity ?? 0,
        img: item.img || "/products/default.png",
        seller: {
          _id: item.seller_id?._id,
          name: item.seller_id?.name || "Unknown",
          // add more seller fields if needed
        },
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

publicRouter.get("/", async (req, res) => {
  try {
    // 🔹 Get all active sellers, excluding sensitive fields
    const sellers = await Seller.find({ isActive: true }).select("-password -__v");

    // 🔹 Get all items regardless of seller status
    const items = await Item.find({})
      .populate("price") // if this is a ref model, otherwise remove
      .populate("seller_id", "-password -__v")
      .select("-__v");

    // 🔹 Format products for public display
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
        category: item.category || "Uncategorized",
        location: item.location || "Unknown",
        available: item.status === "available",
        quantity: item.quantity ?? 0,
        img: item.img || "/products/default.png",
        seller: {
          _id: item.seller_id?._id,
          name: item.seller_id?.name || "Unknown",
        },
      };
    });

    return res.status(200).json({
      sellers, // ✅ still useful for displaying seller list in public directory
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching public marketplace data:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});


export default publicRouter;
