// TestimonialsSection.jsx
import React from 'react';
import { Box, Heading, Text, SimpleGrid } from '@chakra-ui/react';

const TestimonialsSection = () => (
  <Box py={12} px={4} textAlign="center">
    <Heading mb={6}>What Our Users Say</Heading>
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
      <Box>
        <Text fontSize="lg">"VirMar made my first trade online super smooth and safe!"</Text>
        <Text mt={2} fontWeight="bold">– A Happy Buyer</Text>
      </Box>
      <Box>
        <Text fontSize="lg">"The escrow feature is a game changer. Highly recommend!"</Text>
        <Text mt={2} fontWeight="bold">– Trusted Seller</Text>
      </Box>
    </SimpleGrid>
  </Box>
);

export default TestimonialsSection;