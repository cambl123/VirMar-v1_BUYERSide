import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Order identification
    orderNumber: { 
      type: String, 
      unique: true, 
      required: true 
    },
    
    // Parties involved
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
    
    // Order items - array of items in this order
    items: [{
      item_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Item", 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      },
      unitPrice: { 
        type: Number, 
        required: true 
      },
      totalPrice: { 
        type: Number, 
        required: true 
      }
    }],
    
    // Financial breakdown
    subtotal: { 
      type: Number, 
      required: true 
    },
    platformFee: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    shippingCost: { 
      type: Number, 
      default: 0 
    },
    tax: { 
      type: Number, 
      default: 0 
    },
    discount: { 
      type: Number, 
      default: 0 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    
    // Order lifecycle status
    status: {
      type: String,
      enum: [
        "pending",           // Order created, awaiting payment
        "confirmed",         // Payment confirmed, processing
        "processing",        // Seller preparing order
        "shipped",          // Order shipped
        "delivered",        // Order delivered
        "completed",        // Order completed successfully
        "cancelled",        // Order cancelled
        "refunded",         // Order refunded
        "disputed"          // Order in dispute
      ],
      default: "pending"
    },
    
    // Payment information
    paymentMethod: {
      type: String,
      enum: ["wallet", "mobile_money", "credit_card", "bank_transfer"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending"
    },
    
    // Shipping information - Updated for Rwandan hierarchy
    shippingAddress: {
      province: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      district: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      sector: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      cell: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
      streetAddress: String, // Specific street/house number
      notes: String // Any delivery notes
    },
    
    // Selected delivery option for this order
    selectedDeliveryOption: {
      type: {
        type: String,
        enum: ["seller_delivery", "buyer_pickup", "third_party_courier"],
        required: true
      },
      providerName: String, // If third_party_courier
      cost: { type: Number, default: 0 }
    },
    
    // Tracking information
    trackingNumber: String,
    shippingProvider: String, // This will be the seller_delivery or third_party_courier name
    estimatedDelivery: Date,
    actualDelivery: Date,
    
    // Economic analytics fields
    economicMetrics: {
      // Revenue distribution
      sellerRevenue: { type: Number, default: 0 },
      platformRevenue: { type: Number, default: 0 },
      taxRevenue: { type: Number, default: 0 },
      
      // Cost analysis
      processingCost: { type: Number, default: 0 },
      shippingCost: { type: Number, default: 0 },
      
      // Profitability metrics
      grossMargin: { type: Number, default: 0 },
      netMargin: { type: Number, default: 0 }
    },
    
    // Order notes and communication
    notes: String,
    cancelReason: String,
    
    // Timestamps for analytics
    confirmedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    completedAt: Date
  },
  { 
    timestamps: true,
    // Add indexes for better query performance
    indexes: [
      { buyer_id: 1, createdAt: -1 },
      { seller_id: 1, createdAt: -1 },
      { status: 1 },
      { orderNumber: 1 }
    ]
  }
);

// Generate unique order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate order number: ORD-YYYYMMDD-XXXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    this.orderNumber = `ORD-${date}-${randomNum}`;
    
    // Calculate economic metrics
    this.economicMetrics.sellerRevenue = this.subtotal - this.platformFee;
    this.economicMetrics.platformRevenue = this.platformFee;
    this.economicMetrics.taxRevenue = this.tax;
    
    console.log(`📦 Order number generated: ${this.orderNumber}`);
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;