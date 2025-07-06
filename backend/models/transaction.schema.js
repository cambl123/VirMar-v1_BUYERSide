import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // Assuming you have an Item model
        required: true
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer', // Assuming you have a Buyer model
        required: true
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller', // Assuming you have a Seller model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;