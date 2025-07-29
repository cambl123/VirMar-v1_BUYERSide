import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // 🔄 Fetch wallet balance from backend
    const fetchWallet = async () => {
      try {
        const res = await axios.get('/api/buyer/wallet'); // replace with your endpoint
        setBalance(res.data.balance);
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
        toast({
          title: 'Error',
          description: 'Could not load wallet information.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [toast]);

  return (
    <Box p={6}>
      <VStack spacing={6} align="start">
        <Heading size="lg">My Wallet</Heading>

        {loading ? (
          <Spinner />
        ) : (
          <Text fontSize="md">
            Your current balance: <strong>${balance?.toFixed(2)}</strong>
          </Text>
        )}

        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={() => navigate('/buyer/wallet/deposit')}>
            Deposit Funds
          </Button>

          <Button colorScheme="green" onClick={() => navigate('/buyer/wallet/withdraw')}>
            Withdraw Funds
          </Button>

          <Button
            variant="outline"
            colorScheme="gray"
            onClick={() => navigate('/buyer/wallet/transactions')}
          >
            View Transactions
          </Button>
        </HStack>

        <Button
          variant="ghost"
          colorScheme="purple"
          onClick={() => navigate('/buyer/wallet/settings')}
        >
          Update Wallet Settings
        </Button>
      </VStack>
    </Box>
  );
};

export default Wallet;
