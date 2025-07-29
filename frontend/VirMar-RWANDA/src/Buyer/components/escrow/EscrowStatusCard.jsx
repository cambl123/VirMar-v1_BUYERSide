// src/buyer/components/escrow/EscrowStatusCard.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EscrowStatusCard = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const escrowColor = {
    held: 'yellow',
    released: 'green',
    cancelled: 'red',
    completed: 'blue',
    pending: 'gray',
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/buyer/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        setError('Failed to fetch escrow details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error || !order) {
    return (
      <Center mt={10}>
        <Alert status="error" maxW="lg">
          <AlertIcon />
          {error || 'Escrow data not found.'}
        </Alert>
      </Center>
    );
  }

  const { _id, status, totalAmount, transactionStatus } = order;

  return (
    <Box p={5} shadow="md" borderWidth="1px" rounded="md" maxW="lg" mx="auto" bg="white">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Order ID: {_id}
      </Text>
      <Text>Total: ${totalAmount}</Text>
      <Text>
        Order Status: <Badge colorScheme="blue" ml={1}>{status}</Badge>
      </Text>
      <Text>
        Escrow Status:{' '}
        <Badge colorScheme={escrowColor[transactionStatus]} ml={1}>
          {transactionStatus?.toUpperCase()}
        </Badge>
      </Text>
    </Box>
  );
};

export default EscrowStatusCard;
