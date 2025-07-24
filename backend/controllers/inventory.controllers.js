import Inventory from "../models/inventory.model.js";
import Item from "../models/items.model.js";
import Order from "../models/order.model.js";
import { generateNotification } from "../utils/notification.maker.js";
import { sendEmailNotification } from "../utils/email.notification.js";
import mongoose from "mongoose";

// Initialize inventory for a new item
export const initializeInventory = async (req, res) => {
  console.log("📦 Initializing inventory for new item");
  const { itemId } = req.params;
  const { 
    initialStock, 
    costPrice, 
    sellingPrice, 
    minStockLevel = 5,
    maxStockLevel = 1000,
    reorderQuantity = 50,
    supplier 
  } = req.body;
  
  try {
    // Check if item exists and belongs to the seller
    const item = await Item.findById(itemId).populate('store_id');
    if (!item || item.store_id.seller_id.toString() !== req.seller.id) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }
    
    // Check if inventory already exists
    const existingInventory = await Inventory.findOne({ item_id: itemId });
    if (existingInventory) {
      return res.status(400).json({ message: "Inventory already exists for this item" });
    }
    
    // Create new inventory record
    const inventory = new Inventory({
      item_id: itemId,
      currentStock: initialStock,
      availableStock: initialStock,
      minStockLevel,
      maxStockLevel,
      reorderQuantity,
      costPrice,
      sellingPrice,
      supplier,
      movements: [{
        type: "in",
        quantity: initialStock,
        reason: "Initial stock",
        balanceAfter: initialStock
      }],
      analytics: {
        profitMargin: ((sellingPrice - costPrice) / sellingPrice) * 100
      }
    });
    
    await inventory.save();
    
    // Update item quantity
    item.quantity = initialStock;
    await item.save();
    
    res.status(201).json({
      message: "Inventory initialized successfully",
      inventory
    });
    
  } catch (error) {
    console.log(`❌ Error initializing inventory: ${error}`);
    res.status(500).json({ message: "Error initializing inventory" });
  }
};

// Update stock levels (restock, adjustment, etc.)
export const updateStock = async (req, res) => {
  console.log("📈 Updating stock levels");
  const { itemId } = req.params;
  const { 
    type, // "in", "out", "adjustment"
    quantity, 
    reason, 
    reference,
    newCostPrice,
    newSellingPrice 
  } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Get inventory record
    const inventory = await Inventory.findOne({ item_id: itemId }).session(session);
    if (!inventory) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Inventory not found" });
    }
    
    // Validate seller ownership
    const item = await Item.findById(itemId).populate('store_id').session(session);
    if (item.store_id.seller_id.toString() !== req.seller.id) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Calculate new stock level
    let newStock = inventory.currentStock;
    switch (type) {
      case "in":
        newStock += quantity;
        break;
      case "out":
        newStock -= quantity;
        break;
      case "adjustment":
        newStock = quantity; // Direct adjustment to specific quantity
        break;
      default:
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid stock movement type" });
    }
    
    // Validate stock levels
    if (newStock < 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient stock" });
    }
    
    // Update inventory
    inventory.currentStock = newStock;
    inventory.lastStockUpdate = new Date();
    
    // Update pricing if provided
    if (newCostPrice) inventory.costPrice = newCostPrice;
    if (newSellingPrice) inventory.sellingPrice = newSellingPrice;
    
    // Add movement record
    inventory.movements.push({
      type,
      quantity: type === "adjustment" ? quantity - inventory.currentStock : quantity,
      reason,
      reference,
      balanceAfter: newStock
    });
    
    // Check for alerts
    await checkAndCreateAlerts(inventory);
    
    await inventory.save({ session });
    
    // Update item quantity
    item.quantity = newStock;
    await item.save({ session });
    
    await session.commitTransaction();
    
    res.status(200).json({
      message: "Stock updated successfully",
      inventory,
      newStock
    });
    
  } catch (error) {
    await session.abortTransaction();
    console.log(`❌ Error updating stock: ${error}`);
    res.status(500).json({ message: "Error updating stock" });
  } finally {
    session.endSession();
  }
};

// Reserve stock for pending orders
export const reserveStock = async (req, res) => {
  console.log("🔒 Reserving stock for order");
  const { itemId } = req.params;
  const { quantity, orderId } = req.body;
  
  try {
    const inventory = await Inventory.findOne({ item_id: itemId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    
    // Check if enough stock is available
    if (inventory.availableStock < quantity) {
      return res.status(400).json({ 
        message: "Insufficient available stock",
        available: inventory.availableStock,
        requested: quantity
      });
    }
    
    // Reserve stock
    inventory.reservedStock += quantity;
    inventory.movements.push({
      type: "reserved",
      quantity,
      reason: "Order reservation",
      reference: orderId,
      balanceAfter: inventory.currentStock
    });
    
    await inventory.save();
    
    res.status(200).json({
      message: "Stock reserved successfully",
      reservedQuantity: quantity,
      availableStock: inventory.availableStock
    });
    
  } catch (error) {
    console.log(`❌ Error reserving stock: ${error}`);
    res.status(500).json({ message: "Error reserving stock" });
  }
};

// Release reserved stock (when order is cancelled)
export const releaseReservedStock = async (req, res) => {
  console.log("🔓 Releasing reserved stock");
  const { itemId } = req.params;
  const { quantity, orderId } = req.body;
  
  try {
    const inventory = await Inventory.findOne({ item_id: itemId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    
    // Release reserved stock
    inventory.reservedStock = Math.max(0, inventory.reservedStock - quantity);
    inventory.movements.push({
      type: "unreserved",
      quantity,
      reason: "Order cancellation",
      reference: orderId,
      balanceAfter: inventory.currentStock
    });
    
    await inventory.save();
    
    res.status(200).json({
      message: "Reserved stock released successfully",
      releasedQuantity: quantity,
      availableStock: inventory.availableStock
    });
    
  } catch (error) {
    console.log(`❌ Error releasing reserved stock: ${error}`);
    res.status(500).json({ message: "Error releasing reserved stock" });
  }
};

// Get inventory status for seller's items
export const getSellerInventory = async (req, res) => {
  console.log("📊 Getting seller inventory");
  const sellerId = req.seller.id;
  const { status, sortBy = "currentStock", order = "asc" } = req.query;
  
  try {
    // Get all items for this seller
    const sellerItems = await Item.find({ seller_id: sellerId }).select('_id');
    const itemIds = sellerItems.map(item => item._id);
    
    // Build query
    const query = { item_id: { $in: itemIds } };
    if (status) query.status = status;
    
    // Get inventory records
    const inventoryRecords = await Inventory.find(query)
      .populate('item_id', 'name description')
      .sort({ [sortBy]: order === "desc" ? -1 : 1 });
    
    // Calculate summary statistics
    const summary = {
      totalItems: inventoryRecords.length,
      totalValue: inventoryRecords.reduce((sum, inv) => 
        sum + (inv.currentStock * inv.sellingPrice), 0),
      totalCost: inventoryRecords.reduce((sum, inv) => 
        sum + (inv.currentStock * inv.costPrice), 0),
      lowStockItems: inventoryRecords.filter(inv => inv.status === "low_stock").length,
      outOfStockItems: inventoryRecords.filter(inv => inv.status === "out_of_stock").length,
      averageTurnover: inventoryRecords.reduce((sum, inv) => 
        sum + inv.analytics.turnoverRate, 0) / inventoryRecords.length || 0
    };
    
    summary.totalProfit = summary.totalValue - summary.totalCost;
    summary.profitMargin = summary.totalValue > 0 ? 
      (summary.totalProfit / summary.totalValue) * 100 : 0;
    
    res.status(200).json({
      message: "Inventory retrieved successfully",
      inventory: inventoryRecords,
      summary
    });
    
  } catch (error) {
    console.log(`❌ Error getting seller inventory: ${error}`);
    res.status(500).json({ message: "Error retrieving inventory" });
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res) => {
  console.log("⚠️ Getting low stock alerts");
  const sellerId = req.seller.id;
  
  try {
    // Get seller's items
    const sellerItems = await Item.find({ seller_id: sellerId }).select('_id');
    const itemIds = sellerItems.map(item => item._id);
    
    // Get low stock and out of stock items
    const lowStockItems = await Inventory.find({
      item_id: { $in: itemIds },
      status: { $in: ["low_stock", "out_of_stock"] }
    }).populate('item_id', 'name');
    
    // Get active alerts
    const activeAlerts = lowStockItems.filter(inv => 
      inv.alerts.some(alert => alert.isActive)
    );
    
    res.status(200).json({
      message: "Low stock alerts retrieved successfully",
      alerts: activeAlerts,
      summary: {
        lowStock: lowStockItems.filter(inv => inv.status === "low_stock").length,
        outOfStock: lowStockItems.filter(inv => inv.status === "out_of_stock").length,
        totalAlerts: activeAlerts.length
      }
    });
    
  } catch (error) {
    console.log(`❌ Error getting low stock alerts: ${error}`);
    res.status(500).json({ message: "Error retrieving alerts" });
  }
};

// Generate inventory forecast
export const generateInventoryForecast = async (req, res) => {
  console.log("🔮 Generating inventory forecast");
  const { itemId } = req.params;
  const { days = 30 } = req.query;
  
  try {
    const inventory = await Inventory.findOne({ item_id: itemId })
      .populate('item_id', 'name');
    
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    
    // Get historical sales data
    const historicalOrders = await Order.find({
      "items.item_id": itemId,
      status: { $in: ["completed", "delivered"] },
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
    });
    
    // Calculate sales velocity
    const totalSold = historicalOrders.reduce((sum, order) => {
      const item = order.items.find(item => item.item_id.toString() === itemId);
      return sum + (item ? item.quantity : 0);
    }, 0);
    
    const salesVelocity = totalSold / 90; // Average daily sales
    
    // Generate forecast
    const forecast = {
      currentStock: inventory.currentStock,
      availableStock: inventory.availableStock,
      dailySalesVelocity: salesVelocity,
      forecastPeriod: days,
      predictedSales: salesVelocity * days,
      stockoutDate: salesVelocity > 0 ? 
        new Date(Date.now() + (inventory.availableStock / salesVelocity) * 24 * 60 * 60 * 1000) : null,
      reorderRecommendation: {
        shouldReorder: inventory.availableStock <= (salesVelocity * 14), // 2 weeks buffer
        recommendedQuantity: Math.max(inventory.reorderQuantity, salesVelocity * 30), // 30 days supply
        urgency: inventory.availableStock <= (salesVelocity * 7) ? "high" : 
                inventory.availableStock <= (salesVelocity * 14) ? "medium" : "low"
      }
    };
    
    // Update inventory analytics
    inventory.analytics.predictedDemand = forecast.predictedSales;
    inventory.analytics.reorderDate = forecast.stockoutDate;
    await inventory.save();
    
    res.status(200).json({
      message: "Inventory forecast generated successfully",
      forecast
    });
    
  } catch (error) {
    console.log(`❌ Error generating forecast: ${error}`);
    res.status(500).json({ message: "Error generating forecast" });
  }
};

// Helper function to check and create alerts
const checkAndCreateAlerts = async (inventory) => {
  console.log("🚨 Checking for inventory alerts");
  
  // Clear existing alerts
  inventory.alerts = inventory.alerts.filter(alert => !alert.isActive);
  
  // Check for low stock
  if (inventory.currentStock <= inventory.minStockLevel && inventory.currentStock > 0) {
    inventory.alerts.push({
      type: "low_stock",
      message: `Stock is running low. Current: ${inventory.currentStock}, Minimum: ${inventory.minStockLevel}`,
      isActive: true
    });
  }
  
  // Check for out of stock
  if (inventory.currentStock === 0) {
    inventory.alerts.push({
      type: "out_of_stock",
      message: "Item is out of stock",
      isActive: true
    });
  }
  
  // Check for overstock
  if (inventory.currentStock > inventory.maxStockLevel) {
    inventory.alerts.push({
      type: "overstock",
      message: `Stock level exceeds maximum. Current: ${inventory.currentStock}, Maximum: ${inventory.maxStockLevel}`,
      isActive: true
    });
  }
  
  // Check for reorder needed
  const salesVelocity = inventory.analytics.averageSalesPerDay || 0;
  if (salesVelocity > 0 && inventory.currentStock <= (salesVelocity * 14)) {
    inventory.alerts.push({
      type: "reorder_needed",
      message: `Reorder recommended. Current stock will last approximately ${Math.floor(inventory.currentStock / salesVelocity)} days`,
      isActive: true
    });
  }
  
  // Send notifications for critical alerts
  if (inventory.alerts.some(alert => alert.type === "out_of_stock" || alert.type === "low_stock")) {
    // Get item details for notification
    const item = await Item.findById(inventory.item_id).populate('store_id');
    if (item) {
      await generateNotification(
        "Inventory Alert",
        `${item.name} is ${inventory.currentStock === 0 ? 'out of stock' : 'running low'}`,
        item.store_id.seller_id,
        "Seller"
      );
    }
  }
};

// Automated inventory update when order is completed
export const updateInventoryOnOrderComplete = async (orderId) => {
  console.log("🔄 Updating inventory after order completion");
  
  try {
    const order = await Order.findById(orderId);
    if (!order) return;
    
    for (const orderItem of order.items) {
      const inventory = await Inventory.findOne({ item_id: orderItem.item_id });
      if (inventory) {
        // Remove from reserved stock and add to sold analytics
        inventory.reservedStock = Math.max(0, inventory.reservedStock - orderItem.quantity);
        inventory.analytics.totalSold += orderItem.quantity;
        inventory.analytics.totalRevenue += orderItem.totalPrice;
        inventory.lastSale = new Date();
        
        // Update sales velocity
        const daysSinceCreation = Math.max(1, 
          (new Date() - inventory.createdAt) / (1000 * 60 * 60 * 24)
        );
        inventory.analytics.averageSalesPerDay = inventory.analytics.totalSold / daysSinceCreation;
        
        // Calculate turnover rate
        if (inventory.currentStock > 0) {
          inventory.analytics.turnoverRate = inventory.analytics.totalSold / inventory.currentStock;
        }
        
        await inventory.save();
        console.log(`📊 Updated inventory analytics for item: ${orderItem.item_id}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error updating inventory on order complete: ${error}`);
  }
};