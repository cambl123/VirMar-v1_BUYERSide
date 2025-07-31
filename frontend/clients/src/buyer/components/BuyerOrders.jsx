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
} from '@chakra-ui/react';
import axios from 'axios';

const mockOrders = [
  {
    id: 'ORD123456',
    date: '2025-07-01T10:30:00Z',
    status: 'Pending',
    total: 35000,
    items: [
      { name: 'iPhone 15 Pro Max', qty: 1, price: 1500000 },
      { name: 'Phone Case', qty: 2, price: 5000 },
    ],
    shippingAddress: 'Kigali, Rwanda',
    paymentMethod: 'MoMo',
  },
  {
    id: 'ORD654321',
    date: '2025-06-15T15:45:00Z',
    status: 'Delivered',
    total: 720000,
    items: [
      { name: 'MacBook Pro 16" M3', qty: 1, price: 3200000 },
    ],
    shippingAddress: 'Kigali, Rwanda',
    paymentMethod: 'Credit Card',
  },
];

const statusColor = {
  Pending: 'yellow',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: Replace mockOrders with API call
        // const res = await axios.get('http://localhost:5000/api/buyer/orders', { withCredentials: true });
        // setOrders(res.data.orders);
        setOrders(mockOrders);
      } catch (error) {
        toast({
          title: 'Failed to load orders',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCancelOrder = (orderId) => {
    // TODO: call API to cancel order here
    toast({
      title: 'Order cancelled',
      description: `Order ${orderId} has been cancelled.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      )
    );
  };

  if (loading) return <Spinner size="xl" mx="auto" mt={20} display="block" />;

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
              <Spinner size="lg" />
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
