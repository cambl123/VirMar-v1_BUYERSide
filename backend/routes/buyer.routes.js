import express from "express";
import protectBuyerRoute from "../configs/middleware/potect.buyerRoute.js";
import {
  withdrawFromWallet,
  addItemToCart,
  depositToWallet,
  getCartItems,
  getUserProfile,
  login,
  logout,
  register,
} from "../controllers/buyer.controllers.js";

const BuyerRoutes = express.Router();

BuyerRoutes.post("/register", register);
BuyerRoutes.post("/login", login);
BuyerRoutes.get("/logout", logout);
BuyerRoutes.get("/profile", protectBuyerRoute, getUserProfile);

// cart and buying activities
BuyerRoutes.post("/cart/:cartId/item", protectBuyerRoute, addItemToCart);
BuyerRoutes.get("/cart", protectBuyerRoute, getCartItems);

// BuyerRoutes.get('/checkout',protect)

//wallet meaning money routes
BuyerRoutes.post("/deposit", protectBuyerRoute, depositToWallet);
BuyerRoutes.post("/withdrawal",protectBuyerRoute, withdrawFromWallet)

export default BuyerRoutes;
