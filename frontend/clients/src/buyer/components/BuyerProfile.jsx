import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Avatar,
  Button,
  Flex,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust the path as necessary

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchBuyerProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/buyer/profile`, {
          withCredentials: true,
        });

        setBuyer(res.data.buyer);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
        toast({
          title: 'Error loading profile',
          description: err.response?.data?.message || err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerProfile();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={8}
      borderWidth={1}
      borderRadius="lg"
      bg={useColorModeValue('white', 'gray.800')}
      shadow="md"
    >
      <Flex direction="column" align="center">
        <Avatar
          name={buyer.name}
          size="xl"
          mb={4}
          src="" // optional future avatar
        />
        <Heading size="lg">{buyer.name}</Heading>
        <Text color="gray.500" mb={4}>{buyer.email}</Text>

        {/* Optional fields shown only if present */}
        {buyer.walletBalance && (
          <Text mb={2}><strong>Wallet Balance:</strong> {buyer.walletBalance} RWF</Text>
        )}

        {buyer.createdAt && (
          <Text mb={6}><strong>Member Since:</strong> {new Date(buyer.createdAt).toLocaleDateString()}</Text>
        )}

        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <Button colorScheme="blue" variant="outline">
            Edit Profile
          </Button>
          <Button colorScheme="green">
            Go to Wallet
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default BuyerProfile;