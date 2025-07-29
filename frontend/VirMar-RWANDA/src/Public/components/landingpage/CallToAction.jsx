// CallToAction.jsx
import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const CallToAction = () => (
  <Box textAlign="center" py={12}>
    <Heading mb={4}>Ready to get started?</Heading>
    <Text fontSize="lg" mb={6}>Sign up today and join thousands of users on VirMar.</Text>
    <Button colorScheme="blue" size="lg">Get Started</Button>
  </Box>
);

export default CallToAction;