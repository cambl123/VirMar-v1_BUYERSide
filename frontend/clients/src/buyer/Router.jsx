import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Core Components
import BuyerDashboard from './components/BuyerDashboard';
import BuyerProfile from './components/BuyerProfile';
import Wallet from './components/Wallet';
import ProductSearch from './components/ProductSearch';
import ProductDetailsPage from './components/ProductDetailsPage';
import NotFoundPage from '../pages/NotFoundPage';

// Auth & Registration
import BuyerRegisterForm from './forms/BuyerRegisterForm';
import BuyerLoginForm from './forms/BuyerLoginForm';

// Wallet & Transactions
import DepositFunds from './components/DepositFunds';
import DepositSuccess from './components/DepositSuccess';
import DepositFailure from './components/DepositFailure';
import TransactionHistory from './components/TransactionHistory';

// Orders & Wishlist
import BuyerOrders from './components/BuyerOrders';
import BuyerWishlist from './components/BuyerWishlist';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';

// Search & Analytics
import AdvancedProductSearch from './components/AdvancedProductSearch';
import AnalyticsPage from './pages/AnalyticsPage';

// Buyer Help
import BuyerSupport from './components/BuyerSupport';
import BuyerFAQ from './components/BuyerFAQ';

// ✅ Escrow Components
import EscrowFlow from './components/escrow/EscrowFlow';
import EscrowStatusCard from './components/escrow/EscrowStatusCard';
import EscrowExplanation from './components/escrow/EscrowExplanation';

const BuyerRouter = () => {
  return (
    <Routes>
      <Route index element={<BuyerDashboard />} />
      <Route path="dashboard" element={<BuyerDashboard />} />
      <Route path="profile" element={<BuyerProfile />} />

      {/* 🏦 Wallet & Transactions */}
      <Route path="wallet" element={<Wallet />} />
      <Route path="wallet/deposit" element={<DepositFunds />} />
      <Route path="wallet/deposit-success" element={<DepositSuccess />} />
      <Route path="wallet/deposit-failure" element={<DepositFailure />} />
      <Route path="wallet/transactions" element={<TransactionHistory />} />

      {/* 📦 Orders & Wishlist */}
      <Route path="orders" element={<BuyerOrders />} />
      <Route path="wishlist" element={<BuyerWishlist />} />
      <Route path="history" element={<PurchaseHistoryPage />} />

      {/* 🧠 Analytics */}
      <Route path="analytics" element={<AnalyticsPage />} />

      {/* 🔍 Product Search */}
      <Route path="search" element={<AdvancedProductSearch />} />
      <Route path="product/:id" element={<ProductDetailsPage />} />

      {/* 👤 Auth */}
      <Route path="register" element={<BuyerRegisterForm />} />
      <Route path="login" element={<BuyerLoginForm />} />

      {/* 📜 Escrow System */}
      <Route path="escrow" element={<EscrowFlow />} />
      <Route path="escrow/status/:orderId" element={<EscrowStatusCard />} />
      <Route path="escrow/explanation" element={<EscrowExplanation />} />

      {/* 📞 Support */}
      <Route path="support" element={<BuyerSupport />} />
      <Route path="faq" element={<BuyerFAQ />} />

      {/* ❌ Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default BuyerRouter;
