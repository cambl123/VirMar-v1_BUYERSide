// src/components/seller/marketplace/SellerCompetitiveInsights.jsx

import React from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

/**
 * SellerCompetitiveInsights Component
 *
 * Compares seller performance and trends.
 */
function SellerCompetitiveInsights() {
  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      mb={4}
    >
      <Heading size="md" mb={4}>Competitive Insights</Heading>
      <List spacing={3}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          You are in top 20% for order volume in your category
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          Response time faster than 78% of sellers
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          You have 98% positive buyer feedback
        </ListItem>
      </List>
    </Box>
  );
}

export default SellerCompetitiveInsights;
