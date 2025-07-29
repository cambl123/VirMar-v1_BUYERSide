// i want to start fresh
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../configs/token.config.buyer.js";
import Buyer from "../models/buyer.model.js";
import Wallet from "../models/wallet.schema.js";
import Item from "../models/items.model.js";
import { generateNotification } from "../utils/notification.maker.js";
import { sendEmailNotification } from "../utils/email.notification.js";
import { initiatePayment } from "../utils/momoService.js";
// import { verifyTransaction } from "../utils/transaction.init.js";

// more to do in this register function like caching

export const register = async (req, res) => {
  console.log("register");
  const { email, name, password, phone } = req.body;
  try {
    if (!email || !name || !password) {
      return res.status(404).json({ message: "missing fields" });
    }
    const emailExist = await Buyer.findOne({ email });
    if (emailExist) {
      return res.status(404).json({ message: "existing email" });
    }
    const nameExist = await Buyer.findOne({ name });
    if (nameExist) {
      return res.status(404).json({ message: "existing username" });
    }
    const newBuyer = new Buyer({
      name: name,
      password: password,
      email: email,
      phone: phone,
    });
    if (newBuyer) {
      //create a wallet
      const newWallet = new Wallet({
        balance: 0,
        owner: newBuyer._id,
        ownerModel: "Buyer",
        currency: "RWF",
      });
      await newWallet.save();
      newBuyer.wallet_id = newWallet._id;
      console.log("wallet created", newWallet);
      generateTokenAndSetCookie(res, newBuyer);
    }

    await newBuyer.save();
    const buyerNoPassword = newBuyer.toObject();
    delete buyerNoPassword.password;
    // generateNotification('welcome',`welcome ${buyerNoPassword.name}`,buyerNoPassword._id,Buyer)
    // sendEmailNotification(generateNotification('welcome',`welcome ${buyerNoPassword.name}`,buyerNoPassword._id,'Buyer'))
    generateNotification(
      "welcome back",
      `welcome back ${buyerNoPassword.name}`,
      buyerNoPassword._id,
      "Buyer"
    );

    sendEmailNotification(
      "welcome back",
      "you are successfuly logged in with virmar account",
      buyerNoPassword.email
    );
    console.log(`sent email notification`);
    res
      .status(200)
      .json({ message: "successfuly registered", buyer: buyerNoPassword });
  } catch (error) {
    console.log("error in register" + error);
    res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  console.log(req.body);
  const { email, password, name } = req.body;

  try {
    console.log(email);
    //validate emails
    const buyer = await Buyer.findOne({ email });

    if (!buyer) {
      return res.status(403).json({ message: "no user please register" });
    }

    //check if the password is matched
    const isvalidPassword = await bcrypt.compare(password, buyer.password);
    if (!isvalidPassword) {
      return res.status(403).json({ message: "invalid credentials" });
    }

    generateTokenAndSetCookie(res, buyer);

    const buyerWithoutPassword = buyer.toObject();
    delete buyerWithoutPassword.password;

    res
      .status(200)
      .json({ message: "successfully logged in", buyer: buyerWithoutPassword });
  } catch (error) {
    console.log(`erro logging in ${error}`);
    res.status(500).json({ meesage: "error loging in" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token"); // Clear the cookie from the browser

    res.status(200).json({ message: "successfully logged out" });
  } catch (error) {
    console.log(`error logging out ${error}`);
    res.status(500).json({ message: "error logging out" });
  }
};

export const getUserProfile = async (req, res) => {
  const userid = req.user.id;
  try {
    if (!userid) {
      return res.status(404).json({ message: "not authorized" });
    }
    const buyer = await Buyer.findById(userid);
    res.status(200).json({ message: "successfully got profile", buyer: buyer });
  } catch (error) {
    console.log(`error getting profile ${error}`);
    res.status(500).json({ message: "error getting profile" });
  }
};

//cart activities

// export const addItemToCart = async (req, res) => {
//   // when the item is added to cart
//   const product_id = req.params;
//   const { quantity } = req.body;
//   try {
//     const userid = req.user.id;
//     if (!userid) {
//       return res.status(404).json({ message: "not authorized" });
//     }
//     const buyer = await Buyer.findById(userid);
//     //updating the item status to reserved
//     //update the quantity

//     await Item.findByIdAndUpdate(product_id, {
//       status: "reserved",
//       quantity: quantity,
//     });
//     console;
//     buyer.cart.push(product_id);
//     await buyer.save();
//     res.status(200).json({ message: "successfully added item to cart" });
//   } catch (error) {
//     console.log(`error adding item to cart ${error}`);
//     res.statue(500).json({ message: "error adding item to cart" });
//   }
// };

export const getCartItems = async (req, res) => {
  const info = req.user.id;

  console.log(info);

  try {
    if (!info) {
      return res.status(400).json({ message: "unauthorized" });
    }
    const CartItems = await Buyer.findOne({ info });
    console.log("fetched data");
    if (!CartItems) {
      return res.status(401).json({ message: "no item in your cart" });
    }
    return res.status(404).json({ message: "success", data: CartItems });
    //TODO some operations
  } catch (error) {
    console.log("error getting item", error);
  }
};

export const depositToWallet = async (req, res) => {
  const userId = req.user.id;
  const { amount, externalId, payer } = req.body;

  // ✅ Flatten frontend structure for cleaner payloads
  const { partyIdType, partyId } = payer || {};

  // ✅ Validate incoming fields
  if (!partyId || !amount || !externalId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ✅ Step 1: Initiate payment (request funds from payer)
    const paymentRequest = await initiatePayment(partyId, amount, externalId);

    // ✅ Step 2: Confirm that payment was completed externally (e.g., via MoMo verification)
    const isVerified = await verifyPaymentStatus(externalId);
    if (!isVerified) {
      return res.status(402).json({ error: "Payment not verified yet. Please retry once confirmed." });
    }

    // ✅ Step 3: Load buyer
    const buyer = await Buyer.findById(userId);
    if (!buyer) throw new Error("Buyer not found");

    // ✅ Step 4: Load wallet
    const wallet = await Wallet.findById(buyer.wallet_id);
    if (!wallet) throw new Error("Wallet not found");

    // ✅ Step 5: Update wallet balance
    wallet.balance += Number(amount);
    await wallet.save();

    // ✅ Step 6: Log this deposit as a financial transaction
    await Transaction.create({
      item_id: null,           // This is a deposit, not linked to an item
      buyer_id: userId,
      seller_id: null,         // No seller involved in deposits
      quantity: 1,
      totalPrice: amount,
      type: "deposit",         // Custom flag to distinguish from purchases
      timestamp: new Date()
    });

    // ✅ Optional: Notify the user of successful deposit
    await createNotification({
      title: "Deposit Confirmed",
      message: `Your deposit of ${amount} RWF has been credited.`,
      recipientId: userId,
      recipientModel: "Buyer"
    });

    // ✅ Final response
    res.status(200).json({
      status: "✅ Deposit complete",
      payment: paymentRequest,
      wallet
    });

  } catch (error) {
    console.error(`Deposit error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}
// export const

//buyer gets money through deposit, gift, good return, transaction fail, crypto

export const withdrawFromWallet = async (req,res)=>{
  const userId = req.user.id
  console.log(userId)
  //not yet done
  /**
   * algorithm logic
   * 
   */

}



export const deleteCartItem = async (req,res) =>{
  const item_id = req.params
  const user = req.user

  try {
    // const deleteItem = await Item.findByIdAndUpdate({ })
    res.status(400).json({message:'this is delete cart item route'})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'error visiting the delete cart item route'})

  }
}

// backend/controllers/cart.controller.js


export const addItemToCart = async (req, res) => {
  const buyerId = req.user.id;
  const { itemId, quantity } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item || item.quantity < quantity) {
      return res.status(400).json({ message: "Item unavailable or insufficient quantity" });
    }

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Optionally check if item already in cart to update quantity instead of pushing again
    const existingIndex = buyer.cart.findIndex(id => id.toString() === itemId);
    if (existingIndex >= 0) {
      // if you store quantities, update it here
      // assuming cart only stores item IDs for now, skip or extend as needed
    } else {
      buyer.cart.push(itemId);
    }

    await buyer.save();

    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};
