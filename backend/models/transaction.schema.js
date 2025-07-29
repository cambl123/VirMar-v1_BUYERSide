import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "purchase",
        "return",
        "deposit",
        "withdrawal",
        "transfer",
        "escrow",         // ✅ added
      ],
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",      // ✅ Link to order (used in escrow/purchase)
    },

    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },

    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // Buyer / sender
    },

    to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // Seller / receiver
    },

    quantity: {
      type: Number,
      default: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    transactionDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "cancelled",
        "held",        // ✅ Escrow funds are held
        "released",    // ✅ Escrow funds are released to seller
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
