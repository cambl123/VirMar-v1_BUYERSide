import mongoose from "mongoose";
// import Wallet from './wallet.schema.js';

const walletSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "ownerModel",
  },
  ownerModel: {
    type: String,
    required: true,
    enum: ["Seller", "Buyer"],
  },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "RWF" },
});


const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
