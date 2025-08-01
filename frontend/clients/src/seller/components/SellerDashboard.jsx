import React, { useState } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';

import SellerNavbar from './SellerNavbar';
import DashboardLinks from './DashboardLinks';
import Product from './Product';
import DashboardCharts from './DashboardCharts';
import DashboardNotifications from './DashboardNotifications';
import '../styles/DashBoard.css';

const SellerDashboard = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="dashboard-wrapper">
      {/* Navbar gets toggle prop */}
      <SellerNavbar onToggleSidebar={onOpen} />

      <div className="dashboard-main">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <div className="sidebar-box">
            <DashboardLinks />
          </div>
        )}

        {/* Drawer Sidebar for mobile */}
        {isMobile && (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Seller Services</DrawerHeader>
              <DrawerBody>
                <DashboardLinks />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main content */}
        <div className="content-box">
          <Product />
          <hr className="section-divider" />
          <DashboardCharts />
          <div style={{ marginTop: '2.5rem' }}>
            <DashboardNotifications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
