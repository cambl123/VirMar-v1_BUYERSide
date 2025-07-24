import Analytics from "../models/analytics.model.js";
import Order from "../models/order.model.js";
import Buyer from "../models/buyer.model.js";
import Seller from "../models/sellers.model.js";
import Item from "../models/items.model.js";
import Category from "../models/category.model.js";
import Review from "../models/review.model.js";
import Wallet from "../models/wallet.schema.js";
import mongoose from "mongoose";

// Generate comprehensive analytics for a specific period
export const generateAnalytics = async (req, res) => {
  console.log("📊 Generating marketplace analytics");
  const { period = "daily", date } = req.body;
  
  try {
    const targetDate = date ? new Date(date) : new Date();
    const startDate = getStartDate(targetDate, period);
    const endDate = getEndDate(targetDate, period);
    
    console.log(`📅 Analyzing period: ${period} from ${startDate} to ${endDate}`);
    
    // Check if analytics already exist for this period
    let analytics = await Analytics.findOne({ period, date: targetDate });
    
    if (!analytics) {
      analytics = new Analytics({ period, date: targetDate });
    }
    
    // 1. Calculate marketplace-wide metrics
    const marketplaceMetrics = await calculateMarketplaceMetrics(startDate, endDate);
    analytics.marketplace = marketplaceMetrics;
    
    // 2. Calculate category metrics
    const categoryMetrics = await calculateCategoryMetrics(startDate, endDate);
    analytics.categoryMetrics = categoryMetrics;
    
    // 3. Calculate top performers
    const topSellers = await calculateTopSellers(startDate, endDate);
    const topProducts = await calculateTopProducts(startDate, endDate);
    analytics.topSellers = topSellers;
    analytics.topProducts = topProducts;
    
    // 4. Calculate payment method analytics
    const paymentMetrics = await calculatePaymentMetrics(startDate, endDate);
    analytics.paymentMetrics = paymentMetrics;
    
    // 5. Calculate health scores
    const healthScores = await calculateHealthScores(marketplaceMetrics);
    analytics.healthScores = healthScores;
    
    await analytics.save();
    
    res.status(200).json({
      message: "Analytics generated successfully",
      analytics,
      period: { start: startDate, end: endDate }
    });
    
  } catch (error) {
    console.log(`❌ Error generating analytics: ${error}`);
    res.status(500).json({ message: "Error generating analytics", error: error.message });
  }
};

// Get analytics dashboard data
export const getDashboardAnalytics = async (req, res) => {
  console.log("📈 Getting dashboard analytics");
  const { period = "daily", limit = 30 } = req.query;
  
  try {
    // Get recent analytics
    const recentAnalytics = await Analytics.find({ period })
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    // Get current period analytics
    const currentAnalytics = recentAnalytics[0];
    
    // Calculate trends (compare with previous period)
    const previousAnalytics = recentAnalytics[1];
    const trends = calculateTrends(currentAnalytics, previousAnalytics);
    
    // Get real-time metrics (today's data)
    const realTimeMetrics = await getRealTimeMetrics();
    
    res.status(200).json({
      message: "Dashboard analytics retrieved successfully",
      current: currentAnalytics,
      trends,
      realTime: realTimeMetrics,
      historical: recentAnalytics
    });
    
  } catch (error) {
    console.log(`❌ Error getting dashboard analytics: ${error}`);
    res.status(500).json({ message: "Error retrieving dashboard analytics" });
  }
};

// Get economic health report
export const getEconomicHealthReport = async (req, res) => {
  console.log("🏥 Generating economic health report");
  
  try {
    // Get latest analytics
    const latestAnalytics = await Analytics.findOne()
      .sort({ date: -1 });
    
    if (!latestAnalytics) {
      return res.status(404).json({ message: "No analytics data available" });
    }
    
    // Calculate detailed economic indicators
    const economicIndicators = await calculateEconomicIndicators();
    
    // Risk assessment
    const riskAssessment = await calculateRiskAssessment();
    
    // Growth projections
    const growthProjections = await calculateGrowthProjections();
    
    // Market concentration analysis
    const marketConcentration = await calculateMarketConcentration();
    
    const healthReport = {
      overview: {
        overallHealth: latestAnalytics.healthScores.overall,
        lastUpdated: latestAnalytics.date,
        period: latestAnalytics.period
      },
      economicIndicators,
      riskAssessment,
      growthProjections,
      marketConcentration,
      recommendations: generateHealthRecommendations(latestAnalytics)
    };
    
    res.status(200).json({
      message: "Economic health report generated successfully",
      healthReport
    });
    
  } catch (error) {
    console.log(`❌ Error generating health report: ${error}`);
    res.status(500).json({ message: "Error generating health report" });
  }
};

// Get seller performance analytics
export const getSellerAnalytics = async (req, res) => {
  console.log("🏪 Getting seller analytics");
  const sellerId = req.seller.id;
  const { period = "monthly", months = 6 } = req.query;
  
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    // Get seller's orders for the period
    const orders = await Order.find({
      seller_id: sellerId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('items.item_id');
    
    // Calculate seller metrics
    const sellerMetrics = {
      // Revenue metrics
      totalRevenue: orders.reduce((sum, order) => sum + order.economicMetrics.sellerRevenue, 0),
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? 
        orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      
      // Performance metrics
      completionRate: orders.length > 0 ? 
        (orders.filter(order => order.status === "completed").length / orders.length) * 100 : 0,
      cancellationRate: orders.length > 0 ? 
        (orders.filter(order => order.status === "cancelled").length / orders.length) * 100 : 0,
      
      // Product metrics
      totalProducts: await Item.countDocuments({ seller_id: sellerId }),
      activeProducts: await Item.countDocuments({ seller_id: sellerId, status: "available" }),
      
      // Time-based analysis
      monthlyBreakdown: await getSellerMonthlyBreakdown(sellerId, startDate, endDate),
      
      // Top performing products
      topProducts: await getSellerTopProducts(sellerId, startDate, endDate),
      
      // Customer satisfaction
      averageRating: await getSellerAverageRating(sellerId),
      totalReviews: await Review.countDocuments({ seller_id: sellerId, status: "approved" })
    };
    
    // Calculate growth trends
    const growthTrends = await calculateSellerGrowthTrends(sellerId, startDate, endDate);
    
    // Generate recommendations
    const recommendations = generateSellerRecommendations(sellerMetrics);
    
    res.status(200).json({
      message: "Seller analytics retrieved successfully",
      metrics: sellerMetrics,
      trends: growthTrends,
      recommendations
    });
    
  } catch (error) {
    console.log(`❌ Error getting seller analytics: ${error}`);
    res.status(500).json({ message: "Error retrieving seller analytics" });
  }
};

// Helper functions for analytics calculations

const calculateMarketplaceMetrics = async (startDate, endDate) => {
  console.log("🔢 Calculating marketplace metrics");
  
  // Orders analysis
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const platformRevenue = orders.reduce((sum, order) => sum + order.platformFee, 0);
  const sellerRevenue = orders.reduce((sum, order) => sum + order.economicMetrics.sellerRevenue, 0);
  const taxRevenue = orders.reduce((sum, order) => sum + order.tax, 0);
  
  // User metrics
  const newBuyers = await Buyer.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  const newSellers = await Seller.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  // Active users (users who made transactions in this period)
  const activeBuyerIds = [...new Set(orders.map(order => order.buyer_id.toString()))];
  const activeSellerIds = [...new Set(orders.map(order => order.seller_id.toString()))];
  
  // Product metrics
  const newProducts = await Item.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  
  const soldProducts = orders.reduce((sum, order) => 
    sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  
  // Calculate financial health indicators
  const totalWalletBalance = await Wallet.aggregate([
    { $group: { _id: null, total: { $sum: "$balance" } } }
  ]);
  
  const liquidityRatio = totalWalletBalance[0]?.total / (totalRevenue || 1);
  
  return {
    totalRevenue,
    platformRevenue,
    sellerRevenue,
    taxRevenue,
    totalOrders: orders.length,
    completedOrders: orders.filter(order => order.status === "completed").length,
    cancelledOrders: orders.filter(order => order.status === "cancelled").length,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    newBuyers,
    newSellers,
    activeBuyers: activeBuyerIds.length,
    activeSellers: activeSellerIds.length,
    totalProducts: await Item.countDocuments(),
    newProducts,
    soldProducts,
    conversionRate: activeBuyerIds.length > 0 ? (orders.length / activeBuyerIds.length) * 100 : 0,
    liquidityRatio: liquidityRatio || 0,
    marketplaceVelocity: orders.length / ((endDate - startDate) / (1000 * 60 * 60 * 24)) // Orders per day
  };
};

const calculateCategoryMetrics = async (startDate, endDate) => {
  console.log("📂 Calculating category metrics");
  
  const categoryMetrics = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "items",
        localField: "items.item_id",
        foreignField: "_id",
        as: "itemDetails"
      }
    },
    { $unwind: "$itemDetails" },
    {
      $lookup: {
        from: "categories",
        localField: "itemDetails.category_id",
        foreignField: "_id",
        as: "categoryDetails"
      }
    },
    { $unwind: "$categoryDetails" },
    {
      $group: {
        _id: "$categoryDetails._id",
        categoryName: { $first: "$categoryDetails.name" },
        revenue: { $sum: "$items.totalPrice" },
        orders: { $sum: 1 },
        products: { $addToSet: "$items.item_id" },
        totalQuantity: { $sum: "$items.quantity" }
      }
    },
    {
      $project: {
        category_id: "$_id",
        categoryName: 1,
        revenue: 1,
        orders: 1,
        products: { $size: "$products" },
        averagePrice: { $divide: ["$revenue", "$totalQuantity"] }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
  
  // Calculate market share for each category
  const totalRevenue = categoryMetrics.reduce((sum, cat) => sum + cat.revenue, 0);
  
  return categoryMetrics.map(category => ({
    ...category,
    marketShare: totalRevenue > 0 ? (category.revenue / totalRevenue) * 100 : 0
  }));
};

const calculateTopSellers = async (startDate, endDate) => {
  console.log("🏆 Calculating top sellers");
  
  const topSellers = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["completed", "delivered"] }
      }
    },
    {
      $group: {
        _id: "$seller_id",
        revenue: { $sum: "$economicMetrics.sellerRevenue" },
        orders: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "sellers",
        localField: "_id",
        foreignField: "_id",
        as: "sellerDetails"
      }
    },
    { $unwind: "$sellerDetails" },
    {
      $lookup: {
        from: "reviews",
        let: { sellerId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$seller_id", "$$sellerId"] }, status: "approved" } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ],
        as: "ratingData"
      }
    },
    {
      $project: {
        seller_id: "$_id",
        sellerName: "$sellerDetails.name",
        revenue: 1,
        orders: 1,
        rating: { $ifNull: [{ $arrayElemAt: ["$ratingData.avgRating", 0] }, 0] }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);
  
  return topSellers;
};

const calculateTopProducts = async (startDate, endDate) => {
  console.log("🥇 Calculating top products");
  
  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["completed", "delivered"] }
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.item_id",
        revenue: { $sum: "$items.totalPrice" },
        unitsSold: { $sum: "$items.quantity" }
      }
    },
    {
      $lookup: {
        from: "items",
        localField: "_id",
        foreignField: "_id",
        as: "itemDetails"
      }
    },
    { $unwind: "$itemDetails" },
    {
      $lookup: {
        from: "reviews",
        let: { itemId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$item_id", "$$itemId"] }, status: "approved" } },
          { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ],
        as: "ratingData"
      }
    },
    {
      $project: {
        item_id: "$_id",
        productName: "$itemDetails.name",
        revenue: 1,
        unitsSold: 1,
        rating: { $ifNull: [{ $arrayElemAt: ["$ratingData.avgRating", 0] }, 0] }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 }
  ]);
  
  return topProducts;
};

const calculatePaymentMetrics = async (startDate, endDate) => {
  console.log("💳 Calculating payment metrics");
  
  const paymentMetrics = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: "$paymentMethod",
        usage: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
        successful: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "completed"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        method: "$_id",
        usage: 1,
        revenue: 1,
        successRate: { $multiply: [{ $divide: ["$successful", "$usage"] }, 100] }
      }
    }
  ]);
  
  return paymentMetrics;
};

const calculateHealthScores = async (marketplaceMetrics) => {
  console.log("🏥 Calculating health scores");
  
  // Overall health score (weighted average of other scores)
  const liquidityScore = Math.min(marketplaceMetrics.liquidityRatio * 20, 100);
  const growthScore = Math.min(marketplaceMetrics.marketplaceVelocity * 10, 100);
  const stabilityScore = Math.min((marketplaceMetrics.completedOrders / marketplaceMetrics.totalOrders) * 100, 100);
  const competitionScore = Math.min(marketplaceMetrics.activeSellers * 2, 100);
  
  const overallScore = (liquidityScore + growthScore + stabilityScore + competitionScore) / 4;
  
  return {
    overall: Math.round(overallScore),
    liquidity: Math.round(liquidityScore),
    growth: Math.round(growthScore),
    stability: Math.round(stabilityScore),
    competition: Math.round(competitionScore)
  };
};

// Helper function to get date ranges
const getStartDate = (date, period) => {
  const start = new Date(date);
  switch (period) {
    case "daily":
      start.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "quarterly":
      start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "yearly":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }
  return start;
};

const getEndDate = (date, period) => {
  const end = new Date(date);
  switch (period) {
    case "daily":
      end.setHours(23, 59, 59, 999);
      break;
    case "weekly":
      end.setDate(end.getDate() - end.getDay() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "quarterly":
      end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "yearly":
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  return end;
};

// Additional helper functions for comprehensive analytics
const calculateTrends = (current, previous) => {
  if (!current || !previous) return {};
  
  const calculateChange = (currentVal, previousVal) => {
    if (!previousVal) return 0;
    return ((currentVal - previousVal) / previousVal) * 100;
  };
  
  return {
    revenue: calculateChange(current.marketplace.totalRevenue, previous.marketplace.totalRevenue),
    orders: calculateChange(current.marketplace.totalOrders, previous.marketplace.totalOrders),
    users: calculateChange(current.marketplace.activeBuyers, previous.marketplace.activeBuyers),
    conversion: calculateChange(current.marketplace.conversionRate, previous.marketplace.conversionRate)
  };
};

const getRealTimeMetrics = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayOrders = await Order.countDocuments({
    createdAt: { $gte: today }
  });
  
  const todayRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);
  
  return {
    todayOrders,
    todayRevenue: todayRevenue[0]?.total || 0,
    onlineUsers: 0, // Would need WebSocket tracking
    pendingOrders: await Order.countDocuments({ status: "pending" })
  };
};