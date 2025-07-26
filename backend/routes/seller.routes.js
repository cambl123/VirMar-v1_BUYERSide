import express from "express";
import protectSellerRoute from "../configs/middleware/protect.sellerRoute.js";
import {
  register,
  login,
  logout,
  getUserProfile,
  addItemToStore,
  getStoreItems,
  updateItem,
  deleteItem,
} from "../controllers/seller.controllers.js";

const sellerRoutes = express.Router();

sellerRoutes.post("/register", register);
sellerRoutes.post("/login", login);
sellerRoutes.get("/logout", logout);
sellerRoutes.get("/profile", protectSellerRoute, getUserProfile);

// Items CRUD
sellerRoutes.post("/store/:storeId/item", protectSellerRoute, addItemToStore);
sellerRoutes.get("/store/:storeId/items", protectSellerRoute, getStoreItems);
sellerRoutes.patch("/item/:itemId", protectSellerRoute, updateItem);
sellerRoutes.delete("/item/:itemId", protectSellerRoute, deleteItem);

export default sellerRoutes;
