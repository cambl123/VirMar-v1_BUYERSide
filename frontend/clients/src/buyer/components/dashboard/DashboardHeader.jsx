// src/buyer/components/dashboard/DashboardHeader.jsx
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const DashboardHeader = ({ buyerName, walletBalance }) => {
  return (
    <Box mb={6}>
      <Heading size="lg" mb={2}>
        Welcome back,{' '}
        <Text as="span" color="teal.500">
          {buyerName || 'Buyer'}!
        </Text>
      </Heading>
      <Text fontSize="md">
        Wallet Balance:{' '}
        <Text as="span" color="green.500" fontWeight="bold">
          {walletBalance != null ? `${walletBalance} RWF` : 'N/A'}
        </Text>
      </Text>
    </Box>
  );
};

export default DashboardHeader;
