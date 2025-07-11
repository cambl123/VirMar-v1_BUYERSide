import express from "express";
import Seller from "../models/sellers.model.js";
import Item from "../models/items.model.js";

const publicRouter = express.Router();

publicRouter.get("/", async (req, res) => {
  //get suggest sellers for a buyer
  try {
    const info = await Seller.find({ isActive: true });
    const products = await Item.find({});
    console.log(products);
    if (!info || !products) {
      return res.status(404).json({ message: "no sellers or products" });
    }
    const randomSellers = info.sort(() => 0.5 - Math.random()).slice(0, 5);
    randomSellers.forEach((seller) => {
      seller.password = null;
    });
    const randomProducts = info.sort(() => 0.5 - Math.random()).slice(0, 5);

    res.json({ seller: randomSellers, product: randomProducts });
  } catch (error) {
    res.json({ message: error.message });
  }
});
// get all products,featured products

export default publicRouter;
