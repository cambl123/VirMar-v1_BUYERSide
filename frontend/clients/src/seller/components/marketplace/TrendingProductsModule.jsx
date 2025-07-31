// src/components/seller/marketplace/TrendingProductsModule.jsx

import React from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
} from '@chakra-ui/react';

/**
 * TrendingProductsModule Component
 *
 * Displays hot-selling products with visual emphasis.
 */
function TrendingProductsModule() {
  const trending = [
    { name: 'Samsung A32', category: 'Electronics', sales: '1.2K' },
    { name: 'Agro Fertilizer Kit', category: 'Farming', sales: '740' },
    { name: 'LED Smart Bulb', category: 'Home Tech', sales: '520' },
  ];

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
    >
      <Heading size="md" mb={4}>Trending Products</Heading>
      <VStack spacing={4} align="stretch">
        {trending.map((item, i) => (
          <HStack key={i} spacing={4}>
            <Avatar name={item.name} />
            <Box>
              <Text fontWeight="semibold">{item.name}</Text>
              <Badge colorScheme="blue" fontSize="0.7em">
                {item.category}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {item.sales} sales
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default TrendingProductsModule;
