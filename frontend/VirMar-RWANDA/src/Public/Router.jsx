import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import ContactPage from './components/ContactPage';
import BuyerRegisterForm from '.forms/BuyerRegisterForm';
import BuyerLoginForm from './forms/BuyerLoginForm';
import SellerRegisterForm from '.forms/SellerRegisterForm';
import SellerLoginForm from './forms/SellerLoginForm';
import NotFoundPage from '../pages/NotFoundPage';
import MarketplacePage from './components/MarketPlacePage';


/**
 * Public routes accessible by anyone.
 */
const PublicRouter = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path='/marketplace' element={<MarketplacePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/buyer/register" element={<BuyerRegisterForm />} />
      <Route path="/buyer/login" element={<BuyerLoginForm />} />
      <Route path="/seller/register" element={<SellerRegisterForm />} />
      <Route path="/seller/login" element={<SellerLoginForm />} />

       {/* Catch-all for public routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PublicRouter;
