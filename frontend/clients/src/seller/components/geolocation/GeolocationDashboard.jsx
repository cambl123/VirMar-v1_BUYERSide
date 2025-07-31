// src/seller/components/geolocation/GeolocationDashboard.jsx

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
} from '@chakra-ui/react';

import DeliveryAreasManager from './DeliveryAreasManager';
import DeliveryFeesForm from './DeliveryFeesForm';
import MapView from './MapView';

const GeolocationDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box maxW="900px" mx="auto" p={6} bg="white" boxShadow="md" rounded="md">
      <Heading mb={6} textAlign="center" fontWeight="bold" fontSize="xl">
        Geolocation & Delivery Settings
      </Heading>

      <Tabs index={tabIndex} onChange={setTabIndex} variant="enclosed">
        <TabList mb={4} justifyContent="center">
          <Tab>Delivery Areas</Tab>
          <Tab>Delivery Fees</Tab>
          <Tab>Map View</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DeliveryAreasManager />
          </TabPanel>

          <TabPanel>
            <DeliveryFeesForm />
          </TabPanel>

          <TabPanel>
            <MapView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default GeolocationDashboard;
