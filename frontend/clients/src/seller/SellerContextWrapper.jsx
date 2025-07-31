// src/seller/SellerContextWrapper.jsx
import React from 'react';
import { SellerProvider } from './context/SellerContext';
import SellerRouter from './Router';

const SellerContextWrapper = () => (
  <SellerProvider>
    <SellerRouter />
  </SellerProvider>
);

export default SellerContextWrapper;
