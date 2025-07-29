// src/buyer/components/escrow/EscrowExplanation.jsx
import React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  Icon,
  useColorModeValue,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { LockIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { FaShieldAlt } from 'react-icons/fa';

const EscrowExplanation = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Flex justify="center" align="center" minH="80vh" px={4}>
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="xl"
        boxShadow="lg"
        bg={cardBg}
        maxW="lg"
        textAlign="center"
      >
        <VStack spacing={5}>
          <Icon as={FaShieldAlt} boxSize={12} color={iconColor} />
          <Heading size="lg">How Escrow Protects Your Purchase</Heading>

          <Stack spacing={3} fontSize="md">
            <Text>
              <Icon as={LockIcon} color="blue.400" mr={2} />
              Your payment is securely held in escrow when you place an order.
            </Text>

            <Text>
              <Icon as={CheckCircleIcon} color="green.400" mr={2} />
              The seller only receives funds after you confirm delivery and satisfaction.
            </Text>

            <Text>
              This ensures fairness, transparency, and trust for both parties.
            </Text>
          </Stack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default EscrowExplanation;
