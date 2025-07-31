import React, { useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal';  // Import the modal

const mockOrders = [
  {
    orderId: 'order123',
    date: '2025-07-21',
    total: 1500000,
    status: 'Shipped',
    items: [
      { product: 'iPhone 15 Pro Max', price: 1500000 },
    ],
  },
  {
    orderId: 'order124',
    date: '2025-07-20',
    total: 3200000,
    status: 'Delivered',
    items: [
      { product: 'MacBook Pro M3', price: 3200000 },
    ],
  },
];

const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for details modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    // Fetch orders from the API
    setOrders(mockOrders); // Using mock data for now, replace with API call
  }, []);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderDetails = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Box p={5}>
      <Heading as="h2" size="lg" mb={4}>Purchase History</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Date</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th>Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map(order => (
            <Tr key={order.orderId}>
              <Td>{order.orderId}</Td>
              <Td>{order.date}</Td>
              <Td>{order.total}</Td>
              <Td>{order.status}</Td>
              <Td>
                <Button onClick={() => openOrderDetails(order)}>View Details</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={closeOrderDetails}
        order={selectedOrder} // Pass the selected order
      />
    </Box>
  );
};

export default PurchaseHistoryPage;
