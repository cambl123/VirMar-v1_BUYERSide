import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    buyer: {type:mongoose.Schema.Types.ObjectId,ref:"Buyer"},
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "RWF" }
    
})
const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet