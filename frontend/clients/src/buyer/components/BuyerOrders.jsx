// src/buyer/components/BuyerOrders.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  VStack,
  HStack,
  Spinner,
  useToast,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust path if needed

const statusColor = {
  Pending: 'yellow',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState({}); // Track cancellation state per order
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/buyer/orders`, { withCredentials: true });
      setOrders(res.data.orders);
    } catch (error) {
      toast({
        title: 'Failed to load orders',
        description: error.response?.data?.message || 'There was an error fetching your orders.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Set orders to an empty array to show "No orders found."
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCancelOrder = async (orderId) => {
    setIsCancelling((prev) => ({ ...prev, [orderId]: true }));
    try {
      // Use the correct backend route to cancel the order
      const res = await axios.patch(
        `${API_BASE_URL}/api/buyer/order/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );

      toast({
        title: 'Order cancelled',
        description: res.data.message || `Order ${orderId} has been cancelled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Update the local state to reflect the cancelled status
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
    } catch (error) {
      console.error('Cancel order error:', error);
      toast({
        title: 'Failed to cancel order',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCancelling((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size="xl" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box maxW="900px" mx="auto" mt={10} p={6}>
      <Heading mb={6}>My Orders</Heading>

      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th isNumeric>Total (RWF)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{new Date(order.date).toLocaleDateString()}</Td>
                <Td>
                  <Badge colorScheme={statusColor[order.status] || 'gray'}>
                    {order.status}
                  </Badge>
                </Td>
                <Td isNumeric>{order.total.toLocaleString()}</Td>
                <Td>
                  <Button
                    size="sm"
                    mr={2}
                    onClick={() => openOrderDetails(order)}
                  >
                    View Details
                  </Button>
                  {order.status === 'Pending' && (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleCancelOrder(order.id)}
                      isLoading={isCancelling[order.id]}
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

      {/* Order Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!selectedOrder ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
              <Box>
                <Text>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </Text>
                <Text>
                  <strong>Date:</strong>{' '}
                  {new Date(selectedOrder.date).toLocaleString()}
                </Text>
                <Text>
                  <strong>Status:</strong>{' '}
                  <Badge colorScheme={statusColor[selectedOrder.status] || 'gray'}>
                    {selectedOrder.status}
                  </Badge>
                </Text>
                <Text>
                  <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                </Text>
                <Text>
                  <strong>Shipping Address:</strong> {selectedOrder.shippingAddress}
                </Text>
                <Heading size="sm" mt={4} mb={2}>
                  Items
                </Heading>
                <VStack align="start" spacing={2}>
                  {selectedOrder.items.map((item, i) => (
                    <Box
                      key={i}
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      w="100%"
                      bg="gray.50"
                    >
                      <Text>
                        {item.name} - Qty: {item.qty} - Price: {item.price.toLocaleString()} RWF
                      </Text>
                    </Box>
                  ))}
                </VStack>
                <Text mt={4} fontWeight="bold">
                  Total: {selectedOrder.total.toLocaleString()} RWF
                </Text>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BuyerOrders;