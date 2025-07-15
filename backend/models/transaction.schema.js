import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["purchase", "return", "deposit", "withdrawal", "transfer"],
      required: true,
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      // Only required for purchase/return
    },
    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Who is sending money/items
    },
    to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Who is receiving money/items
    },
    quantity: Number,
    totalPrice: Number,
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);


const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
