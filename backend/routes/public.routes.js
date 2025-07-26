import express from "express";
import Seller from "../models/sellers.model.js";
import Item from "../models/items.model.js";
import protectRoutes from "../configs/middleware/protectRoutes.js"
import Buyer from "../models/buyer.model.js"

const publicRouter = express.Router();

publicRouter.get("/", async (req, res) => {
  //get suggest sellers for a buyer
  try {
    const info = await Seller.find({ isActive: true });
    const products = await Item.find({});
    const buyer = await Buyer.find({})
    // console.log(products);
    if (!info || !products) {
      return res.status(404).json({ message: "no sellers or products" });
    }
    const randomSellers = info.sort(() => 0.5 - Math.random()).slice(0, 5);
    randomSellers.forEach((seller) => {
      seller.password = null;
    });
    const randomProducts = info.sort(() => 0.5 - Math.random()).slice(0, 5);

    res.json({ seller: info, product: products, buyers: buyer });
  } catch (error) {
    res.json({ message: error.message });
  }
});
publicRouter.get('/Info',protectRoutes,async (req, res)=>{
  console.log('you hit getting the seller info')
  const {role, id} = req.user
  try {
    if(role==="buyer"){
      // he should get sellers  info of which he sells product he likes and product inthe cart
      return res.status(200).json({message:"you are a buyer"})}
    /// if he is a seller he should get customers who liked him recommendend customers who likes his products
    return res.status(200).json({message:"you are seller"})

  } catch (error) {
    console.log('error getting info',error)
    res.status(500).json({message:error})
  }


})
// get all products,featured products

export default publicRouter;
// this route don't have controller file still in production
