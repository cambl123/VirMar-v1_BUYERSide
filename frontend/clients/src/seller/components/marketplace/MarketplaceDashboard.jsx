// src/seller/components/MarketplaceDashboard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import FiltersPanel from './FiltersPanel';
import SummaryCards from './CardSummary';
import BuyerInsightsModule from './BuyerInsightsModule';
import MarketConditionAnalytics from './MarketConditionAnalytics';
import SellerCompetitiveInsights from './SellerCompetitiveInsights';
import TrendingProductsModule from './TrendingProductsModule';
import DashboardLinks from '../DashboardLinks';

import '../../styles/MarketplaceDashboard.css'; // Make sure this exists and styles are scoped

function MarketplaceDashboard() {
  return (
    <div className="marketplace-dashboard-container">
      {/* Sidebar */}
      <aside className="marketplace-sidebar">
        <DashboardLinks />

        {/* Back to Seller Dashboard */}
        <Link to="/seller/dashboard" className="back-link">
          <ArrowLeft size={18} className="back-icon" />
          Back to Seller Dashboard
        </Link>
      </aside>

      {/* Main Dashboard Content */}
      <main className="marketplace-main">
        <h1 className="marketplace-title">Marketplace Overview</h1>

        {/* Filter Controls */}
        <div className="filters-wrapper">
          <FiltersPanel />
        </div>

        {/* Summary Cards */}
        <div className="summary-cards-wrapper">
          <SummaryCards />
        </div>

        {/* Two-Column Layout */}
        <div className="dashboard-modules-grid">
          {/* Left Column */}
          <div className="dashboard-column">
            <MarketConditionAnalytics />
            <SellerCompetitiveInsights />
          </div>

          {/* Right Column */}
          <div className="dashboard-column">
            <BuyerInsightsModule />
            <TrendingProductsModule />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MarketplaceDashboard;
