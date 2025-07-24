import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema(
  {
    // Commission structure
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: String,
    
    // Commission type
    type: {
      type: String,
      enum: ["percentage", "fixed", "tiered"],
      required: true
    },
    
    // Commission rates
    rate: { 
      type: Number, 
      required: true 
    }, // Percentage (0-100) or fixed amount
    
    // Tiered commission structure
    tiers: [{
      minAmount: { type: Number, required: true },
      maxAmount: Number,
      rate: { type: Number, required: true }
    }],
    
    // Applicable categories
    categories: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category" 
    }],
    
    // Applicable sellers (if specific)
    sellers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller" 
    }],
    
    // Commission validity
    isActive: { 
      type: Boolean, 
      default: true 
    },
    validFrom: { 
      type: Date, 
      default: Date.now 
    },
    validUntil: Date,
    
    // Economic tracking
    analytics: {
      totalCommissionEarned: { type: Number, default: 0 },
      totalTransactions: { type: Number, default: 0 },
      averageCommissionPerTransaction: { type: Number, default: 0 }
    }
  },
  { 
    timestamps: true 
  }
);

const Commission = mongoose.model("Commission", commissionSchema);
export default Commission;