import Order from "../models/order.model.js";
import Store from "../models/store.schema.js"; // Import Store model
import Location from "../models/location.model.js"; // Import Location model
import { generateNotification } from "../utils/notification.maker.js";
import { sendEmailNotification } from "../utils/email.notification.js";
import mongoose from "mongoose";

// Helper function to check if a buyer's address is within a seller's delivery coverage
const checkDeliveryEligibility = async (sellerStoreId, buyerAddress) => {
  console.log("🗺️ Checking delivery eligibility");
  try {
    const store = await Store.findById(sellerStoreId).populate('location.province location.district location.sector location.cell');
    if (!store) {
      console.log("Store not found for delivery eligibility check.");
      return { eligible: false, message: "Seller's store not found." };
    }

    const storeLocation = store.location;
    const deliveryCoverage = store.deliveryCoverage;

    // Fetch full paths for comparison
    const buyerCell = await Location.findById(buyerAddress.cell);
    const buyerSector = await Location.findById(buyerAddress.sector);
    const buyerDistrict = await Location.findById(buyerAddress.district);
    const buyerProvince = await Location.findById(buyerAddress.province);

    if (!buyerCell || !buyerSector || !buyerDistrict || !buyerProvince) {
      console.log("Invalid buyer address components.");
      return { eligible: false, message: "Invalid buyer address." };
    }

    // Determine eligibility based on coverage type
    switch (deliveryCoverage.type) {
      case "national":
        return { eligible: true, message: "National delivery." };

      case "specific_provinces":
        const specificProvinces = deliveryCoverage.value.map(id => id.toString());
        if (specificProvinces.includes(buyerAddress.province.toString())) {
          return { eligible: true, message: "Within specific provinces." };
        }
        break;

      case "specific_districts":
        const specificDistricts = deliveryCoverage.value.map(id => id.toString());
        if (specificDistricts.includes(buyerAddress.district.toString())) {
          return { eligible: true, message: "Within specific districts." };
        }
        break;

      case "specific_sectors":
        const specificSectors = deliveryCoverage.value.map(id => id.toString());
        if (specificSectors.includes(buyerAddress.sector.toString())) {
          return { eligible: true, message: "Within specific sectors." };
        }
        break;

      case "specific_cells":
        const specificCells = deliveryCoverage.value.map(id => id.toString());
        if (specificCells.includes(buyerAddress.cell.toString())) {
          return { eligible: true, message: "Within specific cells." };
        }
        break;

      case "radius_cells":
        // This requires traversing the location hierarchy or using coordinates
        // For simplicity, let's assume a "radius" means within the same district for now,
        // or a direct comparison if cells are directly related in a flat list.
        // A more complex implementation would involve fetching all cells within N hops from store's cell.
        // For now, let's check if it's within the same sector for a small radius.
        const radius = deliveryCoverage.value || 1; // Default to 1 cell radius (i.e., same cell)

        // Simple check: if radius is 0 or 1, must be same cell.
        if (radius <= 1 && storeLocation.cell.toString() === buyerAddress.cell.toString()) {
          return { eligible: true, message: "Within same cell radius." };
        }
        // More complex logic for larger radius would involve fetching neighbors
        // For now, if it's within the same sector, assume it's covered by a small radius
        if (storeLocation.sector.toString() === buyerAddress.sector.toString()) {
          return { eligible: true, message: "Within same sector (simulated radius)." };
        }
        break;

      default:
        console.log(`Unknown delivery coverage type: ${deliveryCoverage.type}`);
        return { eligible: false, message: "Invalid delivery coverage configuration." };
    }

    return { eligible: false, message: "Outside seller's delivery coverage." };

  } catch (error) {
    console.error(`Error in checkDeliveryEligibility: ${error}`);
    return { eligible: false, message: "Error checking delivery eligibility." };
  }
};

// Seller updates delivery status for an order (e.g., "preparing", "out for delivery", "delivered")
export const updateOrderDeliveryStatus = async (req, res) => {
  console.log("🚚 Updating order delivery status");
  const { orderId } = req.params;
  const { 
    status, // e.g., "processing", "shipped", "delivered"
    deliveryNotes, 
    actualDeliveryDate 
  } = req.body;
  const sellerId = req.seller.id; // From seller authentication middleware

  try {
    // Step 1: Find the order and ensure it belongs to the seller
    const order = await Order.findOne({ _id: orderId, seller_id: sellerId }).populate('buyer_id');

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    // Step 2: Validate status transition
    const validTransitions = {
      "confirmed": ["processing", "cancelled"],
      "processing": ["shipped", "cancelled"],
      "shipped": ["delivered"],
      "delivered": ["completed"] // Buyer confirms delivery, then seller marks completed
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ 
        message: `Cannot change status from ${order.status} to ${status}` 
      });
    }

    // Step 3: Update order details
    order.status = status;
    if (deliveryNotes) order.notes = deliveryNotes;
    if (actualDeliveryDate) order.actualDelivery = new Date(actualDeliveryDate);
    
    // Set timestamps based on status
    switch (status) {
      case "shipped":
        order.shippedAt = new Date();
        break;
      case "delivered":
        order.deliveredAt = new Date();
        break;
      case "completed":
        order.completedAt = new Date();
        // Transfer money to seller wallet (handled by order.controllers.js helper)
        // This is typically triggered by buyer confirmation or automated after delivery
        break;
    }

    await order.save();

    // Step 4: Notify buyer about delivery update
    await generateNotification(
      "Order Delivery Update",
      `Your order #${order.orderNumber} is now ${status}.`,
      order.buyer_id._id,
      "Buyer"
    );

    await sendEmailNotification(
      "Your Order Status Update",
      `Your order #${order.orderNumber} is now ${status}.`,
      order.buyer_id.email
    );

    res.status(200).json({
      message: "Order delivery status updated successfully",
      order
    });

  } catch (error) {
    console.log(`❌ Error updating delivery status: ${error}`);
    res.status(500).json({ message: "Error updating delivery status", error: error.message });
  }
};

// Buyer confirms delivery of an order
export const confirmOrderDeliveryByBuyer = async (req, res) => {
  console.log("✅ Buyer confirming order delivery");
  const { orderId } = req.params;
  const buyerId = req.user.id; // From buyer authentication middleware

  try {
    // Step 1: Find the order and ensure it belongs to the buyer
    const order = await Order.findOne({ _id: orderId, buyer_id: buyerId });

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    // Step 2: Validate order status
    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Order must be in 'shipped' status to confirm delivery" });
    }

    // Step 3: Update order status to delivered and then completed
    order.status = "delivered";
    order.deliveredAt = new Date();
    await order.save();

    // Automatically mark as completed after delivery confirmation
    order.status = "completed";
    order.completedAt = new Date();
    await order.save();

    // Step 4: Trigger payment transfer to seller (handled by order.controllers.js helper)
    // This is now handled by the `transferOrderPaymentToSeller` helper called when order status becomes 'completed'
    // in order.controllers.js
        
    // Step 5: Notify seller about delivery confirmation
    await generateNotification(
      "Order Delivered!",
      `Order #${order.orderNumber} has been confirmed as delivered by the buyer.`,
      order.seller_id,
      "Seller"
    );

    res.status(200).json({
      message: "Order delivery confirmed successfully. Order marked as completed.",
      order
    });

  } catch (error) {
    console.log(`❌ Error confirming delivery: ${error}`);
    res.status(500).json({ message: "Error confirming delivery", error: error.message });
  }
};

// Export the helper for use in order creation
export { checkDeliveryEligibility };