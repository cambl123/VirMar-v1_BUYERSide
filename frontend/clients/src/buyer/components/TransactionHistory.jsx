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
  useToast,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust path as needed

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const tableBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Corrected API endpoint to match your backend routes
        const res = await axios.get(`${API_BASE_URL}/api/transaction/transactions`, {
          withCredentials: true,
        });
        setTransactions(res.data.transactions || []); // assuming response has a 'transactions' key
      } catch (err) {
        console.error('Failed to fetch transactions:', err.message);
        toast({
          title: 'Error fetching transactions',
          description: err.response?.data?.message || 'Could not load transaction history.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 🏷️ Dynamic status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  if (loading) {
    return (
      <Center mt={10}>
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Wallet Transaction History
      </Heading>

      {transactions.length === 0 ? (
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
                  <Td isNumeric>{tx.amount?.toLocaleString()}</Td>
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