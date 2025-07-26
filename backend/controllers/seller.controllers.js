import { giveTokenAndCookieForSeller } from "../configs/token.config.seller.js";
import bcrypt from "bcryptjs";
import Seller from "../models/sellers.model.js";
import Store from "../models/store.schema.js";
import Item from "../models/items.model.js";
import Price from "../models/price.schema.js";

// Register
export const register = async (req, res) => {
  const { email, name, password, fullname, phone } = req.body;
  try {
    const emailExist = await Seller.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const nameExist = await Seller.findOne({ name });
    if (nameExist) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newSeller = new Seller({
      name,
      password,
      email,
      fullname,
      phone,
    });
    // Save seller first to get _id
    await newSeller.save();

    const store = await Store.create({
      name: `${newSeller.name}'s Store`,
      seller_id: newSeller._id,
    });

    newSeller.store = store._id;
    await newSeller.save();

    giveTokenAndCookieForSeller(res, newSeller);

    const SellerNoPassword = newSeller.toObject();
    delete SellerNoPassword.password;
    const storeObj = store.toObject();

    res.status(201).json({
      message: "seller created successfully",
      seller: SellerNoPassword,
      store: storeObj,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error during register" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }
    const isvalidPassword = await bcrypt.compare(password, seller.password);
    if (!isvalidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    giveTokenAndCookieForSeller(res, seller);

    const SellerNoPassword = seller.toObject();
    delete SellerNoPassword.password;

    res.status(200).json({
      message: "Successfully logged in",
      seller: SellerNoPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error during login" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error });
  }
};

// Get Profile
export const getUserProfile = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    if (!sellerId) {
      return res.status(400).json({ error: "Missing user ID in token" });
    }
    const seller = await Seller.findById(sellerId).select("-password");
    if (!seller) {
      return res.status(404).json({ error: "User not found in DB" });
    }
    res.status(200).json(seller);
  } catch (err) {
    console.error("getUserProfile Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Add Item to Store
export const addItemToStore = async (req, res) => {
  const { storeId } = req.params;
  const { name, quantity, price, description } = req.body;
  try {
    const priceDoc = await Price.create({ reservedPrice: price });
    const store = await Store.findById(storeId);
    if (!store || store.seller_id.toString() !== req.seller.id) {
      return res.status(403).json({ message: "Not authorized to add items" });
    }
    const newItem = new Item({
      name,
      quantity,
      price: priceDoc._id,
      description,
      store_id: storeId,
    });
    await newItem.save();
    res.status(201).json({
      message: "Item added to store successfully",
      item: newItem,
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Items of Store
export const getStoreItems = async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    if (!store || store.seller_id.toString() !== req.seller.id) {
      return res.status(403).json({ message: "Not authorized to view items" });
    }
    const items = await Item.find({ store_id: storeId }).populate("price");
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error fetching store items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Item
export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
};

// Delete Item
export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const store = await Store.findById(item.store_id);
    if (!store || store.seller_id.toString() !== req.seller.id) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
