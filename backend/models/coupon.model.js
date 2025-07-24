import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // Coupon identification
    code: { 
      type: String, 
      required: true, 
      unique: true,
      uppercase: true,
      trim: true 
    },
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: String,
    
    // Discount details
    type: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      required: true
    },
    value: { 
      type: Number, 
      required: true 
    }, // Percentage (0-100) or fixed amount
    
    // Usage limits
    maxUses: { 
      type: Number, 
      default: null 
    }, // null = unlimited
    usedCount: { 
      type: Number, 
      default: 0 
    },
    maxUsesPerUser: { 
      type: Number, 
      default: 1 
    },
    
    // Validity period
    validFrom: { 
      type: Date, 
      required: true 
    },
    validUntil: { 
      type: Date, 
      required: true 
    },
    
    // Conditions
    minOrderAmount: { 
      type: Number, 
      default: 0 
    },
    maxDiscountAmount: Number, // Cap for percentage discounts
    
    // Applicable items/categories
    applicableCategories: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category" 
    }],
    applicableItems: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Item" 
    }],
    applicableSellers: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller" 
    }],
    
    // Status
    isActive: { 
      type: Boolean, 
      default: true 
    },
    
    // Creator (admin or seller)
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      refPath: "creatorModel" 
    },
    creatorModel: {
      type: String,
      enum: ["Admin", "Seller"]
    },
    
    // Analytics
    analytics: {
      totalUsage: { type: Number, default: 0 },
      totalDiscount: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 }
    }
  },
  { 
    timestamps: true,
    indexes: [
      { code: 1 },
      { validFrom: 1, validUntil: 1 },
      { isActive: 1 }
    ]
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;