// src/buyer/components/escrow/EscrowExplanation.jsx
import React from "react";
import { Box, Text, Heading, Icon, VStack } from "@chakra-ui/react";
import { LockIcon, CheckCircleIcon } from "@chakra-ui/icons";

const EscrowExplanation = () => {
  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      bg="white"
      maxW="lg"
      mx="auto"
    >
      <VStack spacing={4}>
        <Icon as={LockIcon} boxSize={8} color="blue.500" />
        <Heading size="md">How Escrow Protects You</Heading>
        <Text fontSize="sm" textAlign="center">
          When you place an order, your payment is held securely in escrow. 
          The seller only receives the funds once you confirm the item has been delivered and you're satisfied.
        </Text>
        <Icon as={CheckCircleIcon} boxSize={6} color="green.500" />
        <Text fontSize="sm" textAlign="center">
          This ensures fairness, trust, and protection for both you and the seller.
        </Text>
      </VStack>
    </Box>
  );
};

export default EscrowExplanation;
