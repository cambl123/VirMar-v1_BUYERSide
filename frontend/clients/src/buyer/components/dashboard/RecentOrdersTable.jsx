// src/buyer/components/dashboard/RecentOrdersTable.jsx
import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Heading,
  Text,
} from '@chakra-ui/react';

const sampleOrders = [
  { id: 'ord123', product: 'Phone Model X', date: '2025-07-20', status: 'Shipped', amount: 250000 },
  { id: 'ord124', product: 'Wireless Earbuds', date: '2025-07-18', status: 'Delivered', amount: 50000 },
  { id: 'ord125', product: 'Smartwatch Pro', date: '2025-07-15', status: 'Processing', amount: 150000 },
];

const statusColors = {
  Delivered: 'green',
  Shipped: 'blue',
  Processing: 'yellow',
  Cancelled: 'red',
};

const RecentOrdersTable = ({ orders = sampleOrders }) => {
  return (
    <Box mb={8} overflowX="auto">
      <Heading size="md" mb={4}>
        Recent Orders
      </Heading>
      {orders.length === 0 ? (
        <Text>No recent orders found.</Text>
      ) : (
        <Table variant="simple" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Product</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th isNumeric>Amount (RWF)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(({ id, product, date, status, amount }) => (
              <Tr key={id}>
                <Td>{id}</Td>
                <Td>{product}</Td>
                <Td>{date}</Td>
                <Td>
                  <Badge colorScheme={statusColors[status] || 'gray'}>{status}</Badge>
                </Td>
                <Td isNumeric>{amount.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default RecentOrdersTable;
