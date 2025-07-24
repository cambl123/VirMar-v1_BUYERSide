import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Review parties
    buyer_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Buyer", 
      required: true 
    },
    seller_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller", 
      required: true 
    },
    item_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Item", 
      required: true 
    },
    order_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order", 
      required: true 
    },
    
    // Review content
    rating: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 5 
    },
    title: { 
      type: String, 
      trim: true,
      maxlength: 100 
    },
    comment: { 
      type: String, 
      trim: true,
      maxlength: 1000 
    },
    
    // Review media
    images: [String], // Array of image URLs
    
    // Review verification
    isVerifiedPurchase: { 
      type: Boolean, 
      default: true 
    },
    
    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "pending"
    },
    moderationNotes: String,
    
    // Helpfulness tracking
    helpfulVotes: { 
      type: Number, 
      default: 0 
    },
    totalVotes: { 
      type: Number, 
      default: 0 
    },
    
    // Seller response
    sellerResponse: {
      message: String,
      respondedAt: Date
    }
  },
  { 
    timestamps: true,
    indexes: [
      { item_id: 1, status: 1, createdAt: -1 },
      { seller_id: 1, createdAt: -1 },
      { buyer_id: 1, createdAt: -1 }
    ]
  }
);

// Prevent duplicate reviews for same order-item combination
reviewSchema.index({ buyer_id: 1, order_id: 1, item_id: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;