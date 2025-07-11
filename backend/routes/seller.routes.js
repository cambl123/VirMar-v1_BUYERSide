import express from "express";

import {
  addItemToStore,
  getUserProfile,
  login,
  logout,
  register,
} from "../controllers/seller.controllers.js";

import protectSellerRoute from "../configs/middleware/protect.sellerRoute.js";

const sellerRoutes = express.Router();

sellerRoutes.post("/register", register);
sellerRoutes.post("/login", login);
sellerRoutes.get("/logout", logout);
sellerRoutes.get("/profile", protectSellerRoute, getUserProfile);

//inventory creation like store and items
sellerRoutes.post("/store/:storeId/item", protectSellerRoute, addItemToStore);

export default sellerRoutes;
