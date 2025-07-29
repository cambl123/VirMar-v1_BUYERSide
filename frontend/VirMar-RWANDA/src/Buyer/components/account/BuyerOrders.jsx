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
  Spinner,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react';
import axios from 'axios';

// Map order status to Chakra color schemes
const statusColor = {
  Pending: 'yellow',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
};

// Smaller component for the order details modal
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Order Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text><strong>Order ID:</strong> {order.id}</Text>
            <Text><strong>Date:</strong> {new Date(order.date).toLocaleString()}</Text>
            <Text>
              <strong>Status:</strong>{' '}
              <Badge colorScheme={statusColor[order.status] || 'gray'}>{order.status}</Badge>
            </Text>
            <Text><strong>Payment Method:</strong> {order.paymentMethod}</Text>
            <Text><strong>Shipping Address:</strong> {order.shippingAddress}</Text>

            <Heading size="sm" mt={4} mb={2}>Items</Heading>
            <VStack align="start" spacing={2}>
              {order.items.map((item, i) => (
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
              Total: {order.total.toLocaleString()} RWF
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Smaller component for order table row
const OrderRow = ({ order, onViewDetails, onCancel }) => {
  return (
    <Tr>
      <Td>{order.id}</Td>
      <Td>{new Date(order.date).toLocaleDateString()}</Td>
      <Td>
        <Badge colorScheme={statusColor[order.status] || 'gray'}>{order.status}</Badge>
      </Td>
      <Td isNumeric>{order.total.toLocaleString()}</Td>
      <Td>
        <Button size="sm" mr={2} onClick={() => onViewDetails(order)}>
          View Details
        </Button>
        {order.status === 'Pending' && (
          <Button size="sm" colorScheme="red" onClick={() => onCancel(order.id)}>
            Cancel
          </Button>
        )}
      </Td>
    </Tr>
  );
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          // Backend API endpoint here
          'http://localhost:5000/api/buyer/orders',
          { withCredentials: true }
        );
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
        toast({
          title: 'Error loading orders',
          description: err.response?.data?.message || err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  // Handle view details modal open
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  // Cancel order API call
  const handleCancelOrder = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/buyer/orders/${orderId}/cancel`,
        {},
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      toast({
        title: 'Order cancelled',
        description: `Order ${orderId} has been cancelled.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to cancel order',
        description: err.response?.data?.message || err.message || 'Try again later',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
      <Spinner size="xl" mx="auto" mt={20} display="block" />
    );

  if (error)
    return (
      <Box maxW="900px" mx="auto" mt={10} p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );

  return (
    <Box maxW="900px" mx="auto" mt={10} p={6} overflowX={isMobile ? 'auto' : 'visible'}>
      <Heading mb={6}>My Orders</Heading>
      {orders.length === 0 ? (
        <Text>No orders found.</Text>
      ) : (
        <Table variant="simple" size="md" minWidth="600px">
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
              <OrderRow
                key={order.id}
                order={order}
                onViewDetails={openOrderDetails}
                onCancel={handleCancelOrder}
              />
            ))}
          </Tbody>
        </Table>
      )}

      <OrderDetailsModal isOpen={isOpen} onClose={onClose} order={selectedOrder} />
    </Box>
  );
};

export default BuyerOrders;
