import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Center,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust path as needed

const BuyerWallet = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();

  const fetchWalletData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/buyer/profile`, { withCredentials: true }),
        axios.get(`${API_BASE_URL}/api/transaction/transactions`, { withCredentials: true }),
      ]);
      setWalletBalance(balanceRes.data.buyer.walletBalance);
      setTransactions(transactionsRes.data.transactions);
    } catch (err) {
      toast({
        title: 'Failed to fetch wallet info',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      // Clear data on error
      setWalletBalance(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balance & history on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  // Deposit handler
  const handleDeposit = async () => {
    if (!amount || isNaN(amount) || Number(amount) < 100) {
      return toast({
        title: 'Invalid Amount',
        description: 'Enter a valid amount (min 100 RWF)',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }

    setIsDepositing(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/transaction/deposit`,
        { amount: Number(amount) },
        { withCredentials: true }
      );

      toast({
        title: 'Deposit Initiated',
        description: res.data.message || 'Check your phone to approve the payment.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setAmount('');
      await fetchWalletData(); // Re-fetch all data to ensure consistency
    } catch (err) {
      toast({
        title: 'Deposit Failed',
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (loading) {
    return (
      <Center p={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={6}>
      <Heading size="lg" mb={6}>Wallet Overview</Heading>

      <VStack align="start" spacing={4} mb={8}>
        <Text fontSize="xl">
          <strong>Current Balance:</strong> {walletBalance?.toLocaleString() || 'N/A'} RWF
        </Text>

        <HStack>
          <Input
            placeholder="Amount (RWF)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            width="200px"
          />
          <Button
            colorScheme="green"
            onClick={handleDeposit}
            isLoading={isDepositing}
          >
            Deposit via MoMo
          </Button>
        </HStack>
      </VStack>

      <Box>
        <Heading size="md" mb={4}>Transaction History</Heading>
        {transactions.length === 0 ? (
          <Text>No transactions found.</Text>
        ) : (
          <Box overflowX="auto" bg={useColorModeValue('white', 'gray.700')} borderRadius="md" shadow="md">
            <Table variant="simple" size="md">
              <Thead bg={useColorModeValue('gray.100', 'gray.600')}>
                <Tr>
                  <Th>Type</Th>
                  <Th>Amount</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((tx) => (
                  <Tr key={tx._id}>
                    <Td>{tx.type}</Td>
                    <Td>{tx.amount?.toLocaleString()} RWF</Td>
                    <Td>{new Date(tx.date).toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BuyerWallet;