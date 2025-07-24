import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    description: { type: String, trim: true },
    
    // Store's physical location (base for delivery calculations)
    location: {
      province: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      district: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      sector: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      cell: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true }
    },
    
    // Seller's defined delivery coverage
    deliveryCoverage: {
      type: {
        type: String,
        enum: ["radius_cells", "specific_cells", "specific_sectors", "specific_districts", "specific_provinces", "national"],
        default: "radius_cells" // Default to a small radius around the store
      },
      // For "radius_cells": number of cells away from store's cell
      // For "specific_cells", "specific_sectors", etc.: array of Location IDs
      value: mongoose.Schema.Types.Mixed, // Can be a Number (radius) or Array of ObjectIds
      
      // Optional: flat rate for delivery within coverage
      deliveryFee: { type: Number, default: 0 }
    },
    
    // Delivery options offered by the seller
    deliveryOptions: [{
      type: {
        type: String,
        enum: ["seller_delivery", "buyer_pickup", "third_party_courier"],
        required: true
      },
      // If third_party_courier, specify provider (e.g., "Kigali Express")
      providerName: String,
      // Additional costs or notes for this option
      cost: { type: Number, default: 0 },
      notes: String
    }],

    isActive: { type: Boolean, default: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
export default Store;