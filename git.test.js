// import express from "express";

// const app = express();
// const port = 3000;

// // app.get('/', (req, res) => {
// //   res.send('Hello World!');
// //   setInterval(() => {
// //   const buf = Buffer.alloc(1024); // Allocate 1KB briefly
// //   console.log("Memory tick...");
// // }, 600000); // Every 10 minutes

// //})

// app.listen(port, () => {
//   setInterval(() => {
//     const buf = Buffer.alloc(1024); // Allocate 1KB briefly
//     console.log("Memory tick...");
//   }, 600000); // Every 10 minutes

//   console.log(`Server running at http://localhost:${port}`);
// });


const express = require('express');
const app = express();
app.use(express.json());

// In-memory simulation stores
let buyerProfiles = {};
let sellerProfiles = {};
let transactions = [];
let marketInventory = [];
let buyerEngagements = [];
let userNotifications = [];
let reputations = {
  buyers: {},
  sellers: {},
};

// ---------------------------
// Buyer Actions
// ---------------------------

// Deposit RWF to wallet
app.post('/buyer/deposit', (req, res) => {
  const { buyerId, amount } = req.body;
  buyerProfiles[buyerId] = buyerProfiles[buyerId] || { balance: 0, purchases: [], loyaltyPoints: 0 };
  buyerProfiles[buyerId].balance += amount;
  res.send(`Buyer ${buyerId} deposited ${amount} RWF`);
});

// Log product view
app.post('/buyer/view', (req, res) => {
  const { buyerId, productId } = req.body;
  const product = marketInventory.find(p => p.id === productId);
  if (!product) return res.status(404).send('Product not found.');

  buyerEngagements.push({ buyerId, sellerId: product.sellerId, productId, time: Date.now() });

  userNotifications.push({
    sellerId: product.sellerId,
    message: `👀 Buyer ${buyerId} viewed your product: ${product.name}`,
  });

  res.send(`Interaction logged for buyer ${buyerId}`);
});

// Recommend products by past categories
app.get('/buyer/recommendations/:buyerId', (req, res) => {
  const buyer = buyerProfiles[req.params.buyerId];
  if (!buyer) return res.status(404).send('Buyer not found.');

  const categories = buyer.purchases.map(p => p.category);
  const recommended = marketInventory.filter(p => categories.includes(p.category));
  res.send(recommended);
});

// Initiate purchase transaction
app.post('/buyer/pay', (req, res) => {
  const { buyerId, sellerId, amount, item, category } = req.body;

  const buyer = buyerProfiles[buyerId];
  if (!buyer || buyer.balance < amount) {
    return res.status(400).send('Insufficient balance');
  }

  buyer.balance -= amount;

  const record = {
    buyerId,
    sellerId,
    amount,
    item,
    category,
    fulfilled: false,
    verifiedPayment: true,
    verifiedDelivery: false,
    timestamp: Date.now(),
  };

  transactions.push(record);
  res.send(`Transaction initiated for ${item}`);
});

// ---------------------------
// Seller Actions
// ---------------------------

// Register a new product
app.post('/seller/product', (req, res) => {
  const { sellerId, name, price, category } = req.body;
  const id = `${sellerId}-${Date.now()}`;
  marketInventory.push({ id, sellerId, name, price, category });
  res.send(`📦 Product ${name} listed with ID ${id}`);
});

// Fulfill a buyer's order
app.post('/seller/fulfill', (req, res) => {
  const { sellerId, buyerId, item } = req.body;

  let order = transactions.find(o =>
    o.buyerId === buyerId &&
    o.sellerId === sellerId &&
    o.item === item &&
    !o.fulfilled
  );

  if (!order) return res.status(404).send('Order not found');

  order.fulfilled = true;
  order.verifiedDelivery = true;

  sellerProfiles[sellerId] = sellerProfiles[sellerId] || { earnings: 0, fulfilledOrders: 0, badges: [] };
  sellerProfiles[sellerId].earnings += order.amount;
  sellerProfiles[sellerId].fulfilledOrders++;

  if (sellerProfiles[sellerId].fulfilledOrders >= 3 && !sellerProfiles[sellerId].badges.includes("Reliable Seller")) {
    sellerProfiles[sellerId].badges.push("Reliable Seller");
  }

  reputations.sellers[sellerId] = (reputations.sellers[sellerId] || 0) + 1;
  reputations.buyers[buyerId] = (reputations.buyers[buyerId] || 0) + 1;

  buyerProfiles[buyerId].loyaltyPoints += 10;
  buyerProfiles[buyerId].purchases.push({ item, category: order.category });

  res.send(`Order fulfilled. Reputation updated for Buyer ${buyerId} and Seller ${sellerId}`);
});

// Fetch seller's notifications
app.get('/seller/notifications/:sellerId', (req, res) => {
  const { sellerId } = req.params;
  const sellerNotes = userNotifications.filter(n => n.sellerId === sellerId);
  res.send(sellerNotes);
});

// ---------------------------
// Growth & Reputation System
// ---------------------------

// Fetch reputation score
app.get('/reputation/:role/:id', (req, res) => {
  const { role, id } = req.params;
  const score = reputations[role + 's'][id] || 0;
  res.send(`${role} ${id} has a reputation score of ${score}`);
});

// Check wallet or seller earnings
app.get('/wallet/:role/:id', (req, res) => {
  const { role, id } = req.params;
  if (role === 'buyer') {
    const b = buyerProfiles[id];
    if (!b) return res.status(404).send('Buyer not found');
    res.send({ balance: b.balance, loyaltyPoints: b.loyaltyPoints });
  } else {
    const s = sellerProfiles[id];
    if (!s) return res.status(404).send('Seller not found');
    res.send({ earnings: s.earnings, badges: s.badges });
  }
});

// ---------------------------
// Server Start
// ---------------------------

app.listen(3000, () => {
  console.log('🚀 Fintech Relationship Engine active on port 3000');
});
