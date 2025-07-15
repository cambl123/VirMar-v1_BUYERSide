/**
 * Redis throttling per buyer to avoid spamming multiple requests
 *  WebSocket push notifications for real-time seller alerts
 * Activity logs to track transaction attempts and triggers
*/

// transactionService.js
import createNotification from "../utils/notification.maker.js";
import Transaction from "../models/Transaction.js";
import Item from "../models/Item.js";
import Seller from "../models/Seller.js";

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
    await createNotification({
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
