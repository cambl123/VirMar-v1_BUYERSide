import React, { useState } from 'react';
import {
  Box, Button, Input, FormControl, FormLabel, Heading, Text, VStack, useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔄 POST buyer login data to backend
      const { data } = await axios.post('/api/buyer/login', formData);

      // ✅ Notify and redirect
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.buyer?.name || 'Buyer'}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      navigate('/buyer/dashboard');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Check credentials',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={16} p={8} boxShadow="lg" borderRadius="lg" bg="white">
      <Heading size="lg" mb={6} textAlign="center">Buyer Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" onChange={handleChange} value={formData.email} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" onChange={handleChange} value={formData.password} />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">Login</Button>
          <Text fontSize="sm">
            Don’t have an account? <strong><a href="/buyer/register">Register</a></strong>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default BuyerLogin;
