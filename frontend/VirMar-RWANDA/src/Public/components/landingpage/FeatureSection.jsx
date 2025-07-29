// FeaturesSection.jsx
import React from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const FeaturesSection = () => (
  <Box py={12} px={4} textAlign="center">
    <Heading mb={6}>Platform Features</Heading>
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <Box><Heading size="sm">Escrow System</Heading><Text>Secure payment between buyer and seller.</Text></Box>
      <Box><Heading size="sm">Review System</Heading><Text>Leave feedback for transparency.</Text></Box>
      <Box><Heading size="sm">Live Chat</Heading><Text>Talk in real-time before trading.</Text></Box>
    </SimpleGrid>
  </Box>
);

export default FeaturesSection;