import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
  reservedPrice: { type: Number, required: true },
  soldAtPrice: { type: Number, default: null },
  demandPrice: { type: Number, default: null },
  sellingPrice: { type: Number, default: null },
  discountPrice: { type: Number, default: null },

  priceHistory: [{ price: Number, date: Date }],
  demandScore: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 1 },
  priceType: { type: String, enum: ['fixed', 'negotiable', 'dynamic'], default: 'fixed' }
});


const Price = mongoose.model('Price', priceSchema);

export default Price;
