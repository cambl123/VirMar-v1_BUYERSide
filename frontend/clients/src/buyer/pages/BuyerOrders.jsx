import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, Center, Badge, Button, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import BuyerNavbar from '../components/BuyerNavBar';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/buyer/orders', {
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
        `http://localhost:5000/api/buyer/order/${orderId}/cancel`,
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
                <Td>{order.totalAmount} RWF</Td>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {["pending", "confirmed"].includes(order.status) && (
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
