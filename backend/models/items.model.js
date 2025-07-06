//import e from "express";
import mongoose from "mongoose";
//import Price from "./price.schema.js"; // Assuming you have a price schema defined in price.schema.js

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved'],
        default: 'available'
    },
    expiresAt: {
        type: Date,
        default: null

       // required: true
    },
    //price: Price,
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
    }

},{timestamps: true});

const Item = mongoose.model('Item', itemSchema);

export default Item;