// src/buyer/components/escrow/EscrowFlow.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { LockIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { FaTruck } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const steps = [
  { label: 'Payment Held', icon: LockIcon },
  { label: 'Order Shipped', icon: FaTruck },
  { label: 'Delivery Confirmed', icon: CheckCircleIcon },
  { label: 'Funds Released', icon: TimeIcon },
];

const EscrowFlow = () => {
  const { orderId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const iconColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const response = await axios.get(`/api/buyer/orders/${orderId}`);
        const { status, transactionStatus } = response.data.order;

        let stepIndex = 0;

        if (transactionStatus === 'held') stepIndex = 0;
        if (status === 'shipped') stepIndex = 1;
        if (status === 'delivered') stepIndex = 2;
        if (transactionStatus === 'released') stepIndex = 3;

        setActiveStep(stepIndex);
      } catch (err) {
        setError('Failed to load escrow flow. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderId]);

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center mt={10}>
        <Alert status="error" maxW="lg">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={5} maxW="lg" mx="auto" bg="white" borderRadius="xl" boxShadow="md">
      <VStack spacing={6}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <HStack spacing={4}>
              <Icon
                as={step.icon}
                color={index === activeStep ? 'green.500' : iconColor}
                boxSize={6}
              />
              <Text fontWeight={index === activeStep ? 'bold' : 'medium'}>
                {step.label}
              </Text>
            </HStack>
            {index < steps.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default EscrowFlow;
