import Seller from "../models/sellers.model.js"
import { giveTokenAndCookieForSeller } from "../configs/token.config.seller.js";
import bcrypt from 'bcryptjs'
//import store from "../models/store.schema.js";
import Item from "../models/items.model.js";
import Price from "../models/price.schema.js";
import Store from "../models/store.schema.js";

//import { JsonWebTokenError } from "jsonwebtoken";


export const register = async (req, res)=> {
    //this handles the logic of registering creating new seller object into the database
    console.log(req.body)
    
    const { email, name, password, fullname, phone } = req.body
   // console.log(email)

    //check for existing email
//     const emailExist = await Seller.findOne({email})

//     if(emailExist){return res.status(404).json({message:"existing email"})}

//     const nameExist = await Seller.findOne({name})

//     if(nameExist){return res.status(404).json({message:"existing username"})}

//     const newSeller = new Seller({
//         name:name,
//         password:password, //i will hash it later
//         email:email,
//         fullname:fullname,
//         phone:phone
//     })

//     if(newSeller){
//       await newSeller.save();

//       const store  = await Store.create({
//         name: `${newSeller.name}'s Store`,
//         seller_id: newSeller._id // Use seller_id as required by your Store schema
//       });

//       // Optionally, you can associate the store with the seller if needed
//       // newSeller.store = store._id;
//       // await newSeller.save();

//       // Token and response
//       const { token, seller: SellerNoPassword } = giveTokenAndCookieForSeller(res, newSeller);

//       res.status(201).json({
//         message: "seller created successfully",
//         seller: SellerNoPassword
//       });
//       return;
//     }

//     const { token, seller: SellerNoPassword } = giveTokenAndCookieForSeller(res, newSeller);


//     res.status(201).json({
//     message: "seller created successfully",
//     seller: SellerNoPassword
// });
//     // const SellerNoPassword = await Seller.findById(newSeller._id).select('-password')
//     // res.status(201).json({
//     //     message:"seller created successfully",
//     //     seller:SellerNoPassword
//     // })

try {
  // Check for existing email
  const emailExist = await Seller.findOne({ email });
  if (emailExist) {
    return res.status(400).json({ message: "Email already exists" });
  } 
  // Check for existing name
  const nameExist = await Seller.findOne({ name });
  if (nameExist) {
    return res.status(400).json({ message: "Name already exists" });
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
  await newSeller.save()
  // Create a new store for the seller
  if (newSeller){
    const store =  await Store.create({
    name: `${newSeller.name}'s Store`,
    seller_id: newSeller._id // Use seller_id as required by your Store schema
  });
  giveTokenAndCookieForSeller(res, newSeller);
  //return response with the new seller and store information
  //remove password from the response
  const SellerNoPassword = newSeller.toObject();
  delete SellerNoPassword.password;
  //send response
  res.status(201).json({
    message: "seller created successfully",
    seller: SellerNoPassword,
    store: store
  });
}

  // if there is a new seller provide token and cookie
  
  } catch (error) {
  console.error("Error during registration:", error);
  console.log("Error details:", error.message);
  // Handle specific error cases
  res.status(500).json({ message: "Internal server error" });
}

}

//login logic here it goes
export const login = async (req,res)=>{
    console.log("this is the login");

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
    message: "logged in",
    seller: SellerNoPassword
  });

} catch (error) {
  console.log(error);
  res.status(500).json({ message: "internal server error" });
}

   
}

export const logout = async (req,res)=>{
    
    console.log("this is the logout");
    
    res.clearCookie('token'); // Clear the cookie from the browser
    res.status(200).json({ message: "logged out successfully" });
    
}
export const getUserProfile = async (req, res) => {
  try {
    console.log("👤 Decoded user in controller:", req.user);

    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "Missing user ID in token" });
    }

    const user = await Seller.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found in DB" });
    }

    console.log("📦 User profile fetched:", user);
    res.status(200).json(user);

  } catch (err) {
    console.error("🔥 getUserProfile Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
// This function retrieves the user profile based on the user ID stored in the request object.
// It uses the `User` model to find the user by ID and excludes the password field


export const addItemToStore = async (req, res) => {
  const { storeId } = req.params;
  const { name, quantity, price, description } = req.body;
  //i need to create a new price and save it to the price collection
  const priceDoc = await Price.create({
    //does this have an id

    reservedPrice: price,
  });

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

    // await newItem.save();



    // res.status(201).json({
    //   message: "Item added to store successfully",
    //   item: newItem
    // });

  } catch (error) {
    console.error("Error adding item to store:", error);
    res.status(500).json({ message: "Internal server error" });
    
  }
}