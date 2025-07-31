// src/seller/pages/DashboardWrapper.jsx
import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import ProductOverview from '../components/ProductOverview';
import DashboardStats from '../components/DashboardStats';
import SellerLinks from '../components/SellerLinks';
import NotificationPanel from '../components/NotificationPanel';

const DashboardWrapper = () => {
  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Grid layout with 2 rows and responsive columns */}
      <Grid
        templateColumns={{ base: '1fr', md: '2fr 1fr' }}
        templateRows="auto auto"
        gap={6}
      >
        {/* Main Product List + Stats Graphs */}
        <Box gridColumn={{ base: '1', md: '1 / 2' }}>
          <ProductOverview />
          <Box mt={6}>
            <DashboardStats />
          </Box>
        </Box>

        {/* Sidebar: Quick Links + Notifications */}
        <Box gridColumn={{ base: '1', md: '2 / 3' }}>
          <SellerLinks />
          <Box mt={6}>
            <NotificationPanel />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardWrapper;
// this is fotocopy