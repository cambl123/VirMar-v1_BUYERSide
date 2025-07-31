// src/components/seller/marketplace/MarketConditionAnalytics.jsx

import React from 'react';
import {
  Box,
  Heading,
  Text,
  Divider,
  VStack,
} from '@chakra-ui/react';

/**
 * MarketConditionAnalytics Component
 *
 * Shows trends, demand shifts, and region-specific data.
 */
function MarketConditionAnalytics() {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      mb={4}
    >
      <Heading size="md" mb={4}>Market Conditions</Heading>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontWeight="semibold">Top Region: Kigali</Text>
          <Text fontSize="sm">↑ +12.4% growth in Electronics</Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight="semibold">Rising Category</Text>
          <Text fontSize="sm">Groceries demand up 9% across rural zones</Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight="semibold">Inflation Watch</Text>
          <Text fontSize="sm">Stable: +1.2% avg. price rise in July</Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default MarketConditionAnalytics;
