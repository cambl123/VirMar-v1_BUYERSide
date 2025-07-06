import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    reservedPrice: {
        type: Number,
        required: true
    },
    soldAtPrice: {
        type: Number,
        default: null
    },
    demandPrice: {
        type: Number,
        default: null

    },
    sellingPrice: {
        type: Number,
        default: null
    },
    discountPrice: {
        type: Number,
        default: null
    }
});

const Price = mongoose.model('Price', priceSchema);

export default Price;
