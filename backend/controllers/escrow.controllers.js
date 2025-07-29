// backend/controllers/escrow.controllers.js

import Order from "../models/order.model.js";
import Wallet from "../models/wallet.schema.js";
import Transaction from "../models/transaction.schema.js";

/**
 * Release escrow funds from buyer to seller
 * Only the buyer can initiate escrow release
 * Preconditions: Order must exist and be in a releasable state
 */
export const releaseEscrow = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user?.id || req.buyer?.id; // from auth middleware

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer_id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: Buyer only" });
    }

    const tx = await Transaction.findOne({ orderId, type: "escrow" });
    if (!tx || tx.status !== "held") {
      return res.status(404).json({ message: "No held escrow transaction found" });
    }

    const sellerWallet = await Wallet.findOne({ owner: tx.to_user_id });
    if (!sellerWallet) {
      return res.status(404).json({ message: "Seller wallet not found" });
    }

    sellerWallet.balance += tx.totalPrice;
    await sellerWallet.save();

    tx.status = "released";
    await tx.save();

    return res.status(200).json({ message: "Escrow successfully released", transaction: tx });
  } catch (error) {
    console.error("Escrow release error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get escrow status for an order
 */
export const getEscrowStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const tx = await Transaction.findOne({ orderId, type: "escrow" });
    if (!tx) {
      return res.status(404).json({ message: "Escrow transaction not found" });
    }

    return res.status(200).json({ status: tx.status, transaction: tx });
  } catch (error) {
    console.error("Get escrow status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// import Transaction from "../models/transaction.schema.js";
// import Order from "../models/order.model.js";

/**
 * Create an escrow transaction for an order
 * Called when an order is created/paid but funds are held in escrow
 */
export const createEscrowForOrder = async (orderId) => {
  // Find the order details
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  // Check if escrow transaction already exists for this order
  const existingTx = await Transaction.findOne({ orderId, type: "escrow" });
  if (existingTx) {
    // Already created
    return existingTx;
  }

  // Create new escrow transaction - status "held"
  const escrowTx = new Transaction({
    type: "escrow",
    orderId: order._id,
    item_id: order.item_id,
    from_user_id: order.buyer_id,
    to_user_id: order.seller_id,
    quantity: order.quantity,
    totalPrice: order.totalPrice,
    status: "held",
  });

  await escrowTx.save();
  return escrowTx;
};
