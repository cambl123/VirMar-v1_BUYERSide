// src/seller/SellerRouter.jsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import SellerDashboard from './components/SellerDashboard';
import AddProductForm from './forms/AddProductForm';
import SellerProfile from './components/userAccount/SellerProfile';
import TrustScoreCard from './components/TrustScoreCard';
import FollowerNotificationList from './components/FollowerNotificationList';
import NotFoundPage from '../pages/NotFoundPage';
import SellerLoginForm from './forms/SellerLoginForm';
import SellerRegisterForm from './forms/SellerRegisterForm';

import MarketplaceDashboard from './components/marketplace/MarketplaceDashboard';
import GeolocationDashboard from './components/geolocation/GeolocationDashboard';

// ✅ Escrow Component
import SellerEscrowStatus from './components/escrow/SellerEscrowStatus';

const SellerRouter = () => {
  return (
    <Routes>
      <Route index element={<SellerDashboard />} />
      <Route path="dashboard" element={<SellerDashboard />} />
      <Route path="add-product" element={<AddProductForm />} />
      <Route path="login" element={<SellerLoginForm />} />
      <Route path="profile" element={<SellerProfile />} />
      <Route path="trust-score" element={<TrustScoreCard />} />
      <Route path="notifications" element={<FollowerNotificationList />} />
      <Route path="register" element={<SellerRegisterForm />} />
      <Route path="marketplace" element={<MarketplaceDashboard />} />
      <Route path="locate" element={<GeolocationDashboard />} />

      {/* ✅ Escrow Route */}
      <Route path="escrow/status/:orderId" element={<SellerEscrowStatus />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default SellerRouter;
