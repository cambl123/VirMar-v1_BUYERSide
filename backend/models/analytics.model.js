import mongoose from "mongoose";

// Economic analytics aggregation model for real-time business intelligence
const analyticsSchema = new mongoose.Schema(
  {
    // Time period for this analytics record
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
      required: true
    },
    date: { 
      type: Date, 
      required: true 
    },
    
    // Overall marketplace metrics
    marketplace: {
      // Revenue metrics
      totalRevenue: { type: Number, default: 0 },
      platformRevenue: { type: Number, default: 0 },
      sellerRevenue: { type: Number, default: 0 },
      taxRevenue: { type: Number, default: 0 },
      
      // Transaction metrics
      totalOrders: { type: Number, default: 0 },
      completedOrders: { type: Number, default: 0 },
      cancelledOrders: { type: Number, default: 0 },
      averageOrderValue: { type: Number, default: 0 },
      
      // User metrics
      newBuyers: { type: Number, default: 0 },
      newSellers: { type: Number, default: 0 },
      activeBuyers: { type: Number, default: 0 },
      activeSellers: { type: Number, default: 0 },
      
      // Product metrics
      totalProducts: { type: Number, default: 0 },
      newProducts: { type: Number, default: 0 },
      soldProducts: { type: Number, default: 0 },
      
      // Financial health indicators
      conversionRate: { type: Number, default: 0 }, // Orders/Visitors
      customerAcquisitionCost: { type: Number, default: 0 },
      customerLifetimeValue: { type: Number, default: 0 },
      
      // Economic indicators
      economicGrowthRate: { type: Number, default: 0 },
      marketplaceVelocity: { type: Number, default: 0 }, // Speed of transactions
      liquidityRatio: { type: Number, default: 0 } // Available funds/Total transactions
    },
    
    // Category-wise breakdown
    categoryMetrics: [{
      category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      categoryName: String,
      revenue: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      products: { type: Number, default: 0 },
      averagePrice: { type: Number, default: 0 },
      marketShare: { type: Number, default: 0 } // Percentage of total marketplace
    }],
    
    // Top performers
    topSellers: [{
      seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
      sellerName: String,
      revenue: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      rating: { type: Number, default: 0 }
    }],
    
    topProducts: [{
      item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      productName: String,
      revenue: { type: Number, default: 0 },
      unitsSold: { type: Number, default: 0 },
      rating: { type: Number, default: 0 }
    }],
    
    // Geographic distribution (if applicable)
    geographicMetrics: [{
      region: String,
      revenue: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      buyers: { type: Number, default: 0 },
      sellers: { type: Number, default: 0 }
    }],
    
    // Payment method analytics
    paymentMetrics: [{
      method: String,
      usage: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      successRate: { type: Number, default: 0 }
    }],
    
    // Economic health scores (0-100)
    healthScores: {
      overall: { type: Number, default: 0 },
      liquidity: { type: Number, default: 0 },
      growth: { type: Number, default: 0 },
      stability: { type: Number, default: 0 },
      competition: { type: Number, default: 0 }
    }
  },
  { 
    timestamps: true,
    indexes: [
      { period: 1, date: -1 },
      { "marketplace.totalRevenue": -1 },
      { date: -1 }
    ]
  }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;