import Order from "../models/order.model.js";
import Item from "../models/items.model.js";
import Buyer from "../models/buyer.model.js";
import Seller from "../models/sellers.model.js";
import Wallet from "../models/wallet.schema.js";
import Transaction from "../models/transaction.schema.js";
import Commission from "../models/commission.model.js";
import Coupon from "../models/coupon.model.js";
import Store from "../models/store.schema.js"; // Import Store model
import { generateNotification } from "../utils/notification.maker.js";
import { sendEmailNotification } from "../utils/email.notification.js";
import { checkDeliveryEligibility } from "../controllers/shipping.controllers.js"; // Import the new helper
import mongoose from "mongoose";
import { createEscrowForOrder as createEscrow } from './escrow.controllers.js';


// Create order from cart - this is the main checkout process
export const createOrderFromCart = async (req, res) => {
  console.log("🛒 Creating order from cart");
  const buyerId = req.user.id;
  const { 
    shippingAddress, 
    paymentMethod, 
    couponCode,
    notes,
    selectedDeliveryOption // New field for selected delivery option
  } = req.body;

  // Start database session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Get buyer and validate
    const buyer = await Buyer.findById(buyerId).populate('cart').session(session);
    if (!buyer || buyer.cart.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Step 2: Group cart items by seller (marketplace requirement)
    const itemsBySeller = {};
    let totalCartValue = 0;

    for (const itemId of buyer.cart) {
      const item = await Item.findById(itemId).populate('store_id').session(session);
      if (!item || item.quantity <= 0) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: `Item ${item?.name || 'unknown'} is not available` 
        });
      }

      const sellerId = item.store_id.seller_id.toString();
      if (!itemsBySeller[sellerId]) {
        itemsBySeller[sellerId] = [];
      }
      
      itemsBySeller[sellerId].push({
        item,
        quantity: 1, // Default quantity, can be modified
        unitPrice: item.price,
        totalPrice: item.price
      });
      
      totalCartValue += item.price;
    }

    // Step 3: Apply coupon if provided
    let discount = 0;
    let couponDoc = null;
    if (couponCode) {
      couponDoc = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      }).session(session);

      if (couponDoc && totalCartValue >= couponDoc.minOrderAmount) {
        if (couponDoc.type === "percentage") {
          discount = (totalCartValue * couponDoc.value) / 100;
          if (couponDoc.maxDiscountAmount) {
            discount = Math.min(discount, couponDoc.maxDiscountAmount);
          }
        } else if (couponDoc.type === "fixed") {
          discount = Math.min(couponDoc.value, totalCartValue);
        }
        
        // Update coupon usage
        couponDoc.usedCount += 1;
        couponDoc.analytics.totalUsage += 1;
        couponDoc.analytics.totalDiscount += discount;
        await couponDoc.save({ session });
      }
    }

    // Step 3.5: Validate delivery eligibility for each seller
    for (const [sellerId, orderItems] of Object.entries(itemsBySeller)) {
      const sellerStore = await Store.findOne({ seller_id: sellerId }).session(session);
      if (!sellerStore) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Seller store not found for seller ID: ${sellerId}` });
      }

      // If seller_delivery is chosen, check eligibility
      if (selectedDeliveryOption.type === "seller_delivery") {
        const deliveryCheck = await checkDeliveryEligibility(sellerStore._id, shippingAddress);
        if (!deliveryCheck.eligible) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Delivery not available from seller ${sellerStore.name} to the specified address: ${deliveryCheck.message}` });
        }
      }
    }

    // Step 4: Create separate orders for each seller
    const createdOrders = [];
    
    for (const [sellerId, orderItems] of Object.entries(itemsBySeller)) {
      // Calculate order totals
      const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      // Get commission rate for this seller/category
      const commission = await Commission.findOne({ 
        isActive: true,
        $or: [
          { sellers: sellerId },
          { sellers: { $size: 0 } } // Default commission
        ]
      }).session(session);
      
      const platformFee = commission ? 
        (commission.type === "percentage" ? (subtotal * commission.rate) / 100 : commission.rate) : 
        subtotal * 0.05; // Default 5% commission
      
      // Calculate proportional discount for this seller
      const sellerDiscount = (subtotal / totalCartValue) * discount;
      const tax = subtotal * 0.18; // 18% VAT in Rwanda
      
      // Calculate shipping cost based on selected delivery option
      let orderShippingCost = 0;
      if (selectedDeliveryOption.type === "seller_delivery") {
        const sellerStore = await Store.findOne({ seller_id: sellerId }).session(session);
        orderShippingCost = sellerStore?.deliveryCoverage?.deliveryFee || 0;
      } else if (selectedDeliveryOption.type === "third_party_courier") {
        orderShippingCost = selectedDeliveryOption.cost; // Cost provided by frontend for 3rd party
      }
      
      const totalAmount = subtotal + platformFee + tax + orderShippingCost - sellerDiscount;

      // Create order
      const order = new Order({
        buyer_id: buyerId,
        seller_id: sellerId,
        items: orderItems.map(item => ({
          item_id: item.item._id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })),
        subtotal,
        platformFee,
        tax,
        discount: sellerDiscount,
        totalAmount,
        paymentMethod,
        shippingAddress,
        selectedDeliveryOption: {
          type: selectedDeliveryOption.type,
          providerName: selectedDeliveryOption.providerName,
          cost: orderShippingCost
        },
        shippingCost: orderShippingCost, // Store calculated shipping cost
        notes,
        economicMetrics: {
          sellerRevenue: subtotal - platformFee,
          platformRevenue: platformFee,
          taxRevenue: tax,
          shippingCost: orderShippingCost // Add shipping cost to economic metrics
        }
      });

      await order.save({ session });
      createdOrders.push(order);

      // Update item quantities and status
      for (const orderItem of orderItems) {
        await Item.findByIdAndUpdate(
          orderItem.item._id,
          { 
            $inc: { quantity: -orderItem.quantity },
            status: "sold" // Or "reserved" if you want a more granular inventory
          },
          { session }
        );
      }

      // Create transaction record
      await Transaction.create([{
        type: "purchase",
        from_user_id: buyerId,
        to_user_id: sellerId,
        quantity: orderItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: totalAmount,
        status: "pending"
      }], { session });

      // Notify seller
      await generateNotification(
        "New Order",
        `You have received a new order #${order.orderNumber}`,
        sellerId,
        "Seller"
      );

      console.log(`📦 Order created: ${order.orderNumber} for seller: ${sellerId}`);
    }

    // Step 5: Process payment
    if (paymentMethod === "wallet") {
      const wallet = await Wallet.findById(buyer.wallet_id).session(session);
      const totalOrderAmount = createdOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      if (wallet.balance < totalOrderAmount) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Deduct from buyer wallet
      wallet.balance -= totalOrderAmount;
      await wallet.save({ session });

      // Update order payment status
      for (const order of createdOrders) {
        order.paymentStatus = "completed";
        order.status = "confirmed";
        order.confirmedAt = new Date();
        await order.save({ session });
      }
    }

    // Step 6: Clear buyer's cart
    buyer.cart = [];
    await buyer.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // Send confirmation email
    await sendEmailNotification(
      "Order Confirmation",
      `Your order(s) have been confirmed. Order numbers: ${createdOrders.map(o => o.orderNumber).join(', ')}`,
      buyer.email
    );

    res.status(201).json({
      message: "Orders created successfully",
      orders: createdOrders,
      totalAmount: createdOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    });

  } catch (error) {
    await session.abortTransaction();
    console.log(`❌ Error creating order: ${error}`);
    res.status(500).json({ message: "Error creating order", error: error.message });
  } finally {
    session.endSession();
  }
};

// Get buyer's order history
export const getBuyerOrders = async (req, res) => {
  console.log("📋 Getting buyer orders");
  const buyerId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  try {
    const query = { buyer_id: buyerId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('seller_id', 'name fullname')
      .populate('items.item_id', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });

  } catch (error) {
    console.log(`❌ Error getting buyer orders: ${error}`);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

// Get seller's orders
export const getSellerOrders = async (req, res) => {
  console.log("🏪 Getting seller orders");
  const sellerId = req.seller.id;
  const { page = 1, limit = 10, status } = req.query;

  try {
    const query = { seller_id: sellerId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer_id', 'name email')
      .populate('items.item_id', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalOrders = await Order.countDocuments(query);

    // Calculate seller analytics
    const analytics = await Order.aggregate([
      { $match: { seller_id: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$economicMetrics.sellerRevenue" },
          averageOrderValue: { $avg: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      analytics: analytics[0] || {},
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });

  } catch (error) {
    console.log(`❌ Error getting seller orders: ${error}`);
    res.status(500).json({ message: "Error retrieving orders" });
  }
};

// Update order status (seller action)
export const updateOrderStatus = async (req, res) => {
  console.log("🔄 Updating order status");
  const { orderId } = req.params;
  const { status, trackingNumber, notes } = req.body;
  const sellerId = req.seller.id;

  try {
    const order = await Order.findOne({ 
      _id: orderId, 
      seller_id: sellerId 
    }).populate('buyer_id');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status transition
    const validTransitions = {
      "pending": ["confirmed", "cancelled"],
      "confirmed": ["processing", "cancelled"],
      "processing": ["shipped", "cancelled"],
      "shipped": ["delivered"],
      "delivered": ["completed"]
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }

    // Update order
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    // Set timestamps based on status
    switch (status) {
      case "confirmed":
        order.confirmedAt = new Date();
        break;
      case "shipped":
        order.shippedAt = new Date();
        break;
      case "delivered":
        order.deliveredAt = new Date();
        break;
      case "completed":
        order.completedAt = new Date();
        // Transfer money to seller wallet
        await transferOrderPaymentToSeller(order);
        break;
    }

    await order.save();

    // Notify buyer
    await generateNotification(
      "Order Update",
      `Your order #${order.orderNumber} status has been updated to ${status}`,
      order.buyer_id._id,
      "Buyer"
    );

    // Send email notification
    await sendEmailNotification(
      "Order Status Update",
      `Your order #${order.orderNumber} is now ${status}`,
      order.buyer_id.email
    );

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.log(`❌ Error updating order status: ${error}`);
    res.status(500).json({ message: "Error updating order status" });
  }
};

// Helper function to transfer payment to seller
const transferOrderPaymentToSeller = async (order) => {
  try {
    const seller = await Seller.findById(order.seller_id);
    const sellerWallet = await Wallet.findOne({ 
      owner: seller._id, 
      ownerModel: "Seller" 
    });

    if (sellerWallet) {
      sellerWallet.balance += order.economicMetrics.sellerRevenue;
      await sellerWallet.save();

      // Create transaction record
      await Transaction.create({
        type: "transfer",
        from_user_id: null, // Platform
        to_user_id: seller._id,
        totalPrice: order.economicMetrics.sellerRevenue,
        status: "completed"
      });

      console.log(`💰 Transferred ${order.economicMetrics.sellerRevenue} to seller ${seller.name}`);
    }
  } catch (error) {
    console.log(`❌ Error transferring payment to seller: ${error}`);
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  console.log("❌ Cancelling order");
  const { orderId } = req.params;
  const { reason } = req.body;
  const userId = req.user?.id || req.seller?.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user can cancel this order
    const canCancel = order.buyer_id.toString() === userId || 
                     order.seller_id.toString() === userId;
    
    if (!canCancel) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed", "processing"].includes(order.status)) {
      return res.status(400).json({ 
        message: "Order cannot be cancelled at this stage" 
      });
    }

    order.status = "cancelled";
    order.cancelReason = reason;
    await order.save();

    // Refund if payment was completed
    if (order.paymentStatus === "completed") {
      await refundOrderPayment(order);
    }

    // Restore item quantities
    for (const item of order.items) {
      await Item.findByIdAndUpdate(item.item_id, {
        $inc: { quantity: item.quantity },
        status: "available"
      });
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.log(`❌ Error cancelling order: ${error}`);
    res.status(500).json({ message: "Error cancelling order" });
  }
};

// Helper function to refund order payment
const refundOrderPayment = async (order) => {
  try {
    const buyer = await Buyer.findById(order.buyer_id);
    const buyerWallet = await Wallet.findById(buyer.wallet_id);

    if (buyerWallet) {
      buyerWallet.balance += order.totalAmount;
      await buyerWallet.save();

      // Create refund transaction
      await Transaction.create({
        type: "refund",
        from_user_id: null, // Platform
        to_user_id: buyer._id,
        totalPrice: order.totalAmount,
        status: "completed"
      });

      order.paymentStatus = "refunded";
      await order.save();

      console.log(`💸 Refunded ${order.totalAmount} to buyer ${buyer.name}`);
    }
  } catch (error) {
    console.log(`❌ Error processing refund: ${error}`);
  }
};