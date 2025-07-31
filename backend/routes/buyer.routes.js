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
  walletInfo,
} from "../controllers/buyer.controllers.js";
// 📦 Order Controller Imports
import {
  createOrderFromCart,
  getBuyerOrders,
  cancelOrder
} from "../controllers/order.controllers.js";
// bbb brb 

const BuyerRoutes = express.Router();

BuyerRoutes.post("/register", register);
BuyerRoutes.post("/login", login);
BuyerRoutes.get("/logout", logout);
BuyerRoutes.get("/profile", protectBuyerRoute, getUserProfile);

// cart and buying activities
BuyerRoutes.post("/cart/:cartId/item", protectBuyerRoute, addItemToCart);
BuyerRoutes.get("/cart", protectBuyerRoute, getCartItems);

// 🛍️ Create Order (from Cart)
BuyerRoutes.post('/order', protectBuyerRoute, createOrderFromCart); // POST /api/buyer/order

// 📜 Get All Buyer Orders
BuyerRoutes.get('/orders', protectBuyerRoute, getBuyerOrders); // GET /api/buyer/orders

// ❌ Cancel an Order
BuyerRoutes.patch('/order/:orderId/cancel', protectBuyerRoute, cancelOrder); // PATCH /api/buyer/order/:orderId/cancel


// BuyerRoutes.get('/checkout',protect)

//wallet meaning money routes
BuyerRoutes.post("/deposit", protectBuyerRoute, depositToWallet);
BuyerRoutes.post("/withdrawal",protectBuyerRoute, withdrawFromWallet)
BuyerRoutes.get('/wallet',protectBuyerRoute,walletInfo)

// wish list controllers still in production
BuyerRoutes.get('/wishlist',protectBuyerRoute,async (req,res)=>{
  try {
    return res.status(200).json({message:'wishlist'})
  
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
  }
    })

export default BuyerRoutes;
