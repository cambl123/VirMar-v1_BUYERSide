import mongoose from "mongoose";

// Advanced inventory tracking system
const inventorySchema = new mongoose.Schema(
  {
    // Item reference
    item_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Item", 
      required: true,
      unique: true 
    },
    
    // Current stock levels
    currentStock: { 
      type: Number, 
      required: true,
      min: 0 
    },
    reservedStock: { 
      type: Number, 
      default: 0,
      min: 0 
    }, // Stock in pending orders
    availableStock: { 
      type: Number, 
      required: true,
      min: 0 
    }, // currentStock - reservedStock
    
    // Stock thresholds
    minStockLevel: { 
      type: Number, 
      default: 5 
    }, // Reorder point
    maxStockLevel: { 
      type: Number, 
      default: 1000 
    },
    reorderQuantity: { 
      type: Number, 
      default: 50 
    },
    
    // Cost tracking for profitability analysis
    costPrice: { 
      type: Number, 
      required: true 
    }, // What seller paid for the item
    sellingPrice: { 
      type: Number, 
      required: true 
    }, // Current selling price
    
    // Stock movements history
    movements: [{
      type: {
        type: String,
        enum: ["in", "out", "adjustment", "reserved", "unreserved"],
        required: true
      },
      quantity: { 
        type: Number, 
        required: true 
      },
      reason: String,
      reference: String, // Order ID, adjustment reason, etc.
      date: { 
        type: Date, 
        default: Date.now 
      },
      balanceAfter: { 
        type: Number, 
        required: true 
      }
    }],
    
    // Inventory status
    status: {
      type: String,
      enum: ["active", "low_stock", "out_of_stock", "discontinued"],
      default: "active"
    },
    
    // Location tracking (if multiple warehouses)
    location: {
      warehouse: String,
      section: String,
      shelf: String,
      bin: String
    },
    
    // Supplier information
    supplier: {
      name: String,
      contact: String,
      leadTime: { type: Number, default: 7 }, // Days
      minOrderQuantity: { type: Number, default: 1 }
    },
    
    // Analytics for this item
    analytics: {
      totalSold: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      averageSalesPerDay: { type: Number, default: 0 },
      turnoverRate: { type: Number, default: 0 }, // How fast inventory moves
      profitMargin: { type: Number, default: 0 }, // (selling - cost) / selling * 100
      
      // Seasonal patterns
      seasonalDemand: [{
        month: { type: Number, min: 1, max: 12 },
        averageSales: { type: Number, default: 0 }
      }],
      
      // Forecasting
      predictedDemand: { type: Number, default: 0 }, // Next 30 days
      reorderDate: Date // When to reorder based on current sales velocity
    },
    
    // Alerts and notifications
    alerts: [{
      type: {
        type: String,
        enum: ["low_stock", "out_of_stock", "overstock", "slow_moving", "reorder_needed"]
      },
      message: String,
      isActive: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now }
    }],
    
    // Last updated information
    lastStockUpdate: { 
      type: Date, 
      default: Date.now 
    },
    lastSale: Date,
    lastRestock: Date
  },
  { 
    timestamps: true,
    indexes: [
      { item_id: 1 },
      { status: 1 },
      { currentStock: 1 },
      { "analytics.turnoverRate": -1 }
    ]
  }
);

// Update available stock whenever current or reserved stock changes
inventorySchema.pre("save", function (next) {
  this.availableStock = this.currentStock - this.reservedStock;
  
  // Update status based on stock levels
  if (this.currentStock === 0) {
    this.status = "out_of_stock";
  } else if (this.currentStock <= this.minStockLevel) {
    this.status = "low_stock";
  } else {
    this.status = "active";
  }
  
  // Calculate profit margin
  if (this.sellingPrice > 0) {
    this.analytics.profitMargin = ((this.sellingPrice - this.costPrice) / this.sellingPrice) * 100;
  }
  
  console.log(`📦 Inventory updated for item: ${this.item_id}, Available: ${this.availableStock}`);
  next();
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;