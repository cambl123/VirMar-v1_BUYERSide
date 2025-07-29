import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const AssistantWidget = () => {
  return (
    <Box
      position="fixed"
      bottom={6}
      right={6}
      p={4}
      bg="teal.100"
      borderRadius="md"
      boxShadow="md"
      maxWidth="300px"
    >
      <Text fontWeight="bold" mb={2}>
        Virtual Assistant
      </Text>
      <Text fontSize="sm">How can I help you today?</Text>
    </Box>
  );
};

export default AssistantWidget;
