// src/buyer/components/account/TransactionHistory.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get('/api/buyer/transactions'); // 🔄 Replace with real backend
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Transaction History</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : transactions.length === 0 ? (
        <Text>No transactions found.</Text>
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((txn) => (
              <Tr key={txn._id}>
                <Td>{txn._id}</Td>
                <Td>{new Date(txn.date).toLocaleString()}</Td>
                <Td>${txn.amount.toFixed(2)}</Td>
                <Td>{txn.type}</Td>
                <Td>{txn.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default TransactionHistory;
