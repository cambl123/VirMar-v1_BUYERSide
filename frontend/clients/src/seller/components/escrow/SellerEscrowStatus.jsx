// src/seller/components/escrow/SellerEscrowStatus.jsx
import React from "react";
import {
  Box,
  Badge,
  Text,
  VStack,
  Icon,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon, WarningIcon } from "@chakra-ui/icons";

const statusInfo = {
  held: {
    color: "yellow",
    label: "Funds Held",
    icon: LockIcon,
    description: "Payment is securely held in escrow until buyer confirms delivery.",
  },
  released: {
    color: "green",
    label: "Funds Released",
    icon: UnlockIcon,
    description: "Funds have been released to your wallet.",
  },
  cancelled: {
    color: "red",
    label: "Transaction Cancelled",
    icon: WarningIcon,
    description: "This order was cancelled. No funds were released.",
  },
};

const SellerEscrowStatus = ({ status = "held" }) => {
  const info = statusInfo[status] || statusInfo["held"];

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
        <HStack>
          <Icon as={info.icon} color={`${info.color}.500`} boxSize={6} />
          <Badge colorScheme={info.color} fontSize="1em">
            {info.label}
          </Badge>
        </HStack>
        <Tooltip label={info.description} fontSize="sm" hasArrow>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            {info.description}
          </Text>
        </Tooltip>
      </VStack>
    </Box>
  );
};

export default SellerEscrowStatus;
