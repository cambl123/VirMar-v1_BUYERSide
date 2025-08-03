import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, Center, Badge, Button, useToast, Text
} from '@chakra-ui/react';
import axios from 'axios';
// Corrected import to match the standard PascalCase naming convention
import BuyerNavbar from '../components/BuyerNavbar'; 

import { API_BASE_URL } from '../../configs/api.config'; // Adjust the import path as necessary

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/buyer/orders`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not fetch orders.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/buyer/order/${orderId}/cancel`,
        { reason: "Changed my mind" }, // You can prompt for input later
        { withCredentials: true }
      );
      toast({
        title: 'Order Cancelled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchOrders(); // refresh
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to cancel order',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={6}>
      <BuyerNavbar />
      <Heading size="lg" mb={4}>🧾 My Orders</Heading>

      {loading ? (
        <Center><Spinner size="xl" /></Center>
      ) : orders.length === 0 ? (
        <Center p={10}>
          <Text fontSize="lg" color="gray.500">You have not placed any orders yet.</Text>
        </Center>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order #</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(order => (
              <Tr key={order._id}>
                <Td>{order.orderNumber || order._id.slice(-6)}</Td>
                <Td>
                  <Badge colorScheme={
                    order.status === 'pending' ? 'yellow' :
                    order.status === 'confirmed' ? 'green' :
                    order.status === 'cancelled' ? 'red' : 'blue'
                  }>
                    {order.status}
                  </Badge>
                </Td>
                <Td>{formatCurrency(order.totalAmount)}</Td>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default BuyerOrders;