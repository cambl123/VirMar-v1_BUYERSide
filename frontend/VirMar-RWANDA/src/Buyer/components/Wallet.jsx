// src/buyer/components/Wallet.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaWallet, FaPlusCircle, FaCog, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Wallet = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('/api/buyer/wallet');
        setBalance(res.data.balance);
      } catch (err) {
        setError('Could not fetch wallet balance.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <Center minH="50vh">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center mt={10}>
        <Alert status="error" maxW="md">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box maxW="md" mx="auto" p={6} bg="white" rounded="lg" shadow="md">
      <VStack spacing={5} align="stretch">
        <HStack justify="center">
          <Icon as={FaWallet} boxSize={10} color="blue.500" />
          <Heading size="lg">My Wallet</Heading>
        </HStack>

        <Box textAlign="center">
          <Text fontSize="xl">Available Balance</Text>
          <Text fontSize="3xl" fontWeight="bold" color="green.500">
            ${balance?.toFixed(2)}
          </Text>
        </Box>

        <VStack spacing={3}>
          <Button
            leftIcon={<FaPlusCircle />}
            colorScheme="green"
            width="100%"
            onClick={() => navigate('/wallet/deposit')}
          >
            Deposit Funds
          </Button>

          <Button
            leftIcon={<FaArrowUp />}
            colorScheme="blue"
            variant="outline"
            width="100%"
            onClick={() => navigate('/wallet/transactions')}
          >
            View Transactions
          </Button>

          <Button
            leftIcon={<FaCog />}
            colorScheme="gray"
            variant="ghost"
            width="100%"
            onClick={() => navigate('/account/settings')}
          >
            Wallet Settings
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Wallet;
