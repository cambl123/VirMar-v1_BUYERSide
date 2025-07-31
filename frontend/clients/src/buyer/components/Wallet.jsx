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
} from '@chakra-ui/react';
import axios from 'axios';

const BuyerWallet = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const toast = useToast();

  // Fetch wallet balance & history
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // 👇 Replace this with your backend wallet endpoint
        const res = await axios.get('http://localhost:5000/api/buyer/wallet', {
          withCredentials: true,
        });

        // 👉 Expected response:
        // { walletBalance: 5000, transactions: [ { id, type, amount, date } ] }
        setWalletBalance(res.data.walletBalance);
        setTransactions(res.data.transactions);
      } catch (err) {
        toast({
          title: 'Failed to fetch wallet info',
          description: err.response?.data?.message || err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

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
      // 👇 Replace this with your MoMo deposit route
      const res = await axios.post(
        'http://localhost:5000/api/buyer/wallet/deposit',
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
      // Re-fetch balance
      setWalletBalance(prev => prev + Number(amount));
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
      <Box p={10} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={6}>
      <Heading size="lg" mb={6}>Wallet Overview</Heading>

      <VStack align="start" spacing={4} mb={8}>
        <Text fontSize="xl">
          <strong>Current Balance:</strong> {walletBalance} RWF
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
          <Table variant="simple" bg={useColorModeValue('white', 'gray.700')} borderRadius="md" overflow="hidden">
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
                  <Td>{tx.amount} RWF</Td>
                  <Td>{new Date(tx.date).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default BuyerWallet;
