// src/buyer/components/escrow/EscrowFlow.jsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  LockIcon,
  TimeIcon,
  CheckCircleIcon,
} from "@chakra-ui/icons";
import { Truck } from "lucide-react"; // Truck icon from lucide

const steps = [
  { label: "Payment Held", icon: LockIcon },
  { label: "Order Shipped", icon: Truck },
  { label: "Delivery Confirmed", icon: CheckCircleIcon },
  { label: "Funds Released", icon: TimeIcon },
];

const EscrowFlow = () => {
  const iconColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box p={5} maxW="lg" mx="auto" bg="white" borderRadius="xl" boxShadow="md">
      <VStack spacing={6}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <HStack spacing={4}>
              <Icon as={step.icon} color={iconColor} boxSize={6} />
              <Text fontWeight="semibold">{step.label}</Text>
            </HStack>
            {index < steps.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default EscrowFlow;
