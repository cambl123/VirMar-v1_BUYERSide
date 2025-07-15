import { giveTokenAndCookieForSeller } from "../configs/token.config.seller.js";


import bcrypt from 'bcryptjs'


import Seller from "../models/sellers.model.js"
import Store from "../models/store.schema.js";
import Item from "../models/items.model.js";
import Price from "../models/price.schema.js";

//TODO: validation required for required in the db
//authentication and authorization logic here
export const register = async (req, res)=> {
    //registeration

    const { email, name, password, fullname, phone } = req.body


  try {
    // Check for existing email
      const emailExist = await Seller.findOne({ email });

      if (emailExist) {
        return res.status(400).json({ message: "Email already exists  at validate email" });
      }
      // Check for existing name
      const nameExist = await Seller.findOne({ name });
      if (nameExist) {
        return res.status(400).json({ message: "existing user" });
      }
      //create new seller
      const newSeller = new Seller({
        name: name,
        password: password, // Hashing will be done later
        email: email,
        fullname: fullname,
        phone: phone
      });
      // Save the new seller
      //await newSeller.save()
      // Create a new store for the seller
     // if (!newSeller) { return res.status(404).json({ message: "failed to create seller" }); }

          const store =  await Store.create({
          name: `${newSeller.name}'s Store`,
          seller_id: newSeller._id // Use seller_id as required by your Store schema
         });



        // Add the store to the seller's stores array
        newSeller.store = store._id;
        await newSeller.save();

      giveTokenAndCookieForSeller(res, newSeller);
      //return response with the new seller and store information
      //remove password from the response
      const SellerNoPassword = newSeller.toObject();
      delete SellerNoPassword.password;
      //send response
      const storeObj = store.toObject()
      res.status(201).json({
        message: "seller created successfully",
        seller: SellerNoPassword,
        store: storeObj
      });


    // if there is a new seller provide token and cookie

    } catch (error) {
    console.error("Error during registration:", error);
    console.log("Error details:", error.message);
    // Handle specific error cases
    res.status(500).json({ message: "Internal server error during register" });
  }

}
export const login = async (req,res)=>{

  const { email, name, password } = req.body;
    console.log({ email, name });

  try {
    const seller = await Seller.findOne({ email }).select("+password"); // add +password if schema hides it

    if (!seller) {
      return res.status(404).json({ message: "oops not found" });
    }

    const isvalidPassword = await bcrypt.compare(password, seller.password);
    if (!isvalidPassword) {
      return res.status(401).json({ message: "invalid credential" });
    }

    // Generate token and set cookie
    giveTokenAndCookieForSeller(res, seller);

    // Remove password from seller object before sending
    const SellerNoPassword = seller.toObject();
    delete SellerNoPassword.password;

    res.status(200).json({
      message: "successfuly logged in",
      seller: SellerNoPassword
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error during log in" });
  }


}
export const logout = async (req,res)=>{
  try {

    res.clearCookie('token'); // Clear the cookie from the browser
    res.status(200).json({ message: "logged out successfully" });

  } catch (error) {
    console.log(error)
    res.status(403).json({message: error})
  }



}


export const getUserProfile = async (req, res) => {
  try {
    console.log("👤 Decoded user in controller:", req.seller);
    //the user id is gotten from protect routes
    console.log("👤 Decoded user in controller:", req.seller);
    const sellerId = req.seller.id
    if (!sellerId) {
      return res.status(400).json({ error: "Missing user ID in token" });
    }

    const seller = await Seller.findById(sellerId).select("-password");

    if (!seller) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    console.log("📦 User profile fetched:");
    res.status(200).json(seller);

  } catch (err) {
    console.error("🔥 getUserProfile Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};


//inventory creation and manipulation
export const addItemToStore = async (req, res) => {
  const { storeId } = req.params;
  const { name, quantity, price, description } = req.body;
  //i need to create a new price and save it to the price collection
  const priceDoc = await Price.create({
    //does this have an id

    reservedPrice: price,
  });
  const store = await Store.findById(storeId);
    if (!store || store.seller_id.toString() !== req.seller.id) {
    return res.status(403).json({ message: "Not authorized to add items to this store" });
    }

  try {
    const newItem = new Item({
      name,
      quantity,
      price: priceDoc._id,
      description,
      store_id: storeId,
      description
    });

    await newItem.save();



    res.status(201).json({
      // newItem.price = priceDoc._id;
      description,
      store_id: storeId,
      message: "Item added to store successfully",
      item: newItem
    });
    // TODO: get the user associated with this store



  } catch (error) {
    console.error("Error adding item to store:", error);
    res.status(500).json({ message: "Internal server error" });

  }
}
//update item
export const updateItem = async (req,res)=>{
    const itemId = req.params
    // const seller = req.seller
    console.log(itemId, req.body)


  try {
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });


  } catch (error) {
    console.log(`error updating item ${error} `)
    res.status(500).json({message: "error updating item"})
  }

}
