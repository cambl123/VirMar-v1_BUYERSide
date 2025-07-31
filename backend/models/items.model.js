import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // ✅ This is what allows .populate("seller_id")
  },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
    },
    expiresAt: {
        type: Date,
        default: null

       
    },
   
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store', // Assuming you have a store model
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    //at the item every item has a price
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price', // Assuming you have a price model
        required: true
    },
    

},{timestamps: true});

const Item = mongoose.model('Item', itemSchema);

export default Item;