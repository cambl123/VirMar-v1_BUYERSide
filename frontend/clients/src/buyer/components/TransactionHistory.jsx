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
  Badge,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // ✅ Insert your backend endpoint for wallet transaction history
        // This route must be protected and send back transaction data
        const res = await axios.get('http://localhost:5000/api/buyer/wallet/transactions', {
          withCredentials: true,
        });
        setTransactions(res.data); // adjust if your response uses a different structure
      } catch (err) {
        console.error('Failed to fetch transactions:', err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 🏷️ Dynamic status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'green';
      case 'failed':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Wallet Transaction History
      </Heading>

      {loading ? (
        <Spinner size="xl" thickness="4px" color="blue.500" />
      ) : transactions.length === 0 ? (
        <Text>No transactions found.</Text>
      ) : (
        <Box overflowX="auto" bg={tableBg} p={4} borderRadius="lg" shadow="md">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th isNumeric>Amount (RWF)</Th>
                <Th>Status</Th>
                <Th>Reference</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((tx) => (
                <Tr key={tx._id}>
                  <Td>{new Date(tx.date).toLocaleString()}</Td>
                  <Td textTransform="capitalize">{tx.type}</Td>
                  <Td isNumeric>{tx.amount.toLocaleString()}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(tx.status)}>{tx.status}</Badge>
                  </Td>
                  <Td>{tx.reference || '—'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default TransactionHistory;
