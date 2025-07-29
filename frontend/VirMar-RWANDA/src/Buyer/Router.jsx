import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Core Components
import BuyerDashboard from '../public/done/BuyerDashboard';
import BuyerProfile from '../public/done/BuyerProfile';
import Wallet from './components/Wallet';
import ProductSearch from './components/ProductSearch';
import ProductDetailsPage from './components/marketplace/ProductDetailsPage';
import NotFoundPage from '../pages/NotFoundPage';



// Wallet & Transactions
import DepositFunds from './components/DepositFunds';
import DepositSuccess from '../public/done/DepositSuccess';
import DepositFailure from '../public/done/DepositFailure';
import TransactionHistory from './components/TransactionHistory';

// Orders & Wishlist
import BuyerOrders from '../public/done/BuyerOrders';
import BuyerWishlist from '../public/done/BuyerWishlist';
import PurchaseHistoryPage from './pages/PurchaseHistoryPage';

// Search & Analytics
import AdvancedProductSearch from './components/AdvancedProductSearch';
import AnalyticsPage from './pages/AnalyticsPage';

// Buyer Help
import BuyerSupport from '../public/done/BuyerSupport';
import BuyerFAQ from '../public/done/BuyerFAQ';

// ✅ Escrow Components
// DONE
import EscrowFlow from './components/escrow/EscrowFlow';
import EscrowStatusCard from './components/escrow/EscrowStatusCard';
import EscrowExplanation from './components/escrow/EscrowExplanation';

// Marketplace Components (added at root paths)
//DONE
import ProductList from './components/marketplace/ProductList';
import ProductTable from './components/marketplace/ProductTable';
import ProductListTable from './components/marketplace/ProductListTable';

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

      {/* Marketplace Routes (at root, not nested under /marketplace) */}
      <Route path="products-list" element={<ProductList />} />
      <Route path="products-table" element={<ProductTable />} />
      <Route path="products-list-table" element={<ProductListTable />} />

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
