/**
 * Redis throttling per buyer to avoid spamming multiple requests
 *  WebSocket push notifications for real-time seller alerts
 * Activity logs to track transaction attempts and triggers
*/

// transactionService.js
import { generateNotification } from "../utils/notification.maker.js";
import Transaction from "../models/transaction.schema.js";
import Item from "../models/items.model.js";
import Seller from "../models/sellers.model.js";

export async function createTransaction({
  item_id,
  buyer_id,
  seller_id,
  quantity,
  totalPrice,
  caller_id,
  caller_role // from auth context
}) {
  try {
    // ✅ Validate payload
    if (!item_id || !seller_id || !buyer_id || quantity <= 0 || totalPrice <= 0) {
      throw new Error("Invalid transaction data");
    }

    // ✅ Authorization
    if (caller_role !== "buyer" || caller_id !== buyer_id) {
      throw new Error("Unauthorized transaction attempt");
    }

    // ✅ Validate seller & item
    const seller = await Seller.findById(seller_id);
    const item = await Item.findOne({ _id: item_id, seller_id });

    if (!seller || !item) {
      throw new Error("Seller or item not found");
    }

    // ✅ Create transaction
    const transaction = await Transaction.create({
      item_id,
      buyer_id,
      seller_id,
      quantity,
      totalPrice
    });

    // ✅ Notify seller
    await generateNotification({
      title: "New Transaction",
      message: "A new transaction has been requested",
      recipientId: seller_id,
      recipientModel: "Seller"
    });

    return { success: true, message: "Transaction created", transaction };

  } catch (error) {
    console.error("Transaction creation failed:", error.message);
    return { success: false, error: error.message };
  }
}
import Wallet from "../models/wallet.schema.js";

// Deposit funds to buyer wallet
export const depositFunds = async (req, res) => {
  try {
    const buyerId = req.user.id; // Assuming user is authenticated and user id is here
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    // Find buyer's wallet
    const wallet = await Wallet.findOne({ owner: buyerId, ownerModel: "Buyer" });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Add funds to wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Create a transaction record
    const transaction = await Transaction.create({
      type: "deposit",
      from_user_id: null, // Platform or external source
      to_user_id: buyerId,
      totalPrice: amount,
      status: "completed",
      transactionDate: new Date(),
    });

    return res.status(200).json({
      message: "Deposit successful",
      newBalance: wallet.balance,
      transaction,
    });

  } catch (error) {
    console.error("Deposit funds error:", error);
    return res.status(500).json({ message: "Server error during deposit" });
  }
};
