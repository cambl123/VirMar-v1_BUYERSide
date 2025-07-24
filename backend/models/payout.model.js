import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    // Payout recipient
    seller_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Seller", 
      required: true 
    },
    
    // Payout details
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: "RWF" 
    },
    
    // Payout period
    periodStart: { 
      type: Date, 
      required: true 
    },
    periodEnd: { 
      type: Date, 
      required: true 
    },
    
    // Orders included in this payout
    orders: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order" 
    }],
    
    // Financial breakdown
    grossSales: { 
      type: Number, 
      required: true 
    },
    platformFees: { 
      type: Number, 
      required: true 
    },
    refunds: { 
      type: Number, 
      default: 0 
    },
    adjustments: { 
      type: Number, 
      default: 0 
    },
    netAmount: { 
      type: Number, 
      required: true 
    },
    
    // Payout status
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "cancelled"],
      default: "pending"
    },
    
    // Payment method for payout
    payoutMethod: {
      type: String,
      enum: ["bank_transfer", "mobile_money", "wallet"],
      required: true
    },
    
    // Bank details (if bank transfer)
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      routingNumber: String
    },
    
    // Mobile money details
    mobileMoneyDetails: {
      phoneNumber: String,
      provider: String
    },
    
    // Processing information
    processedAt: Date,
    transactionId: String, // External payment processor transaction ID
    failureReason: String,
    
    // Notes
    notes: String
  },
  { 
    timestamps: true,
    indexes: [
      { seller_id: 1, createdAt: -1 },
      { status: 1 },
      { periodStart: 1, periodEnd: 1 }
    ]
  }
);

const Payout = mongoose.model("Payout", payoutSchema);
export default Payout;