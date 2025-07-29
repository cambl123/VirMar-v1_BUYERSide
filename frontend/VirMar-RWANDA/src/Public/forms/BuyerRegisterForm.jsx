import React, { useState } from 'react';
import {
  Box, Button, Input, FormControl, FormLabel, Heading, Text, VStack, useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: ''
  });

  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔄 POST buyer registration to backend
      const { data } = await axios.post('/api/buyer/register', formData);

      toast({
        title: 'Registration successful',
        description: `Welcome ${data.buyer?.name || 'Buyer'}!`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      navigate('/buyer/login');
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Please try again',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={16} p={8} boxShadow="lg" borderRadius="lg" bg="white">
      <Heading size="lg" mb={6} textAlign="center">Buyer Registration</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input name="name" onChange={handleChange} value={formData.name} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" onChange={handleChange} value={formData.email} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" type="tel" onChange={handleChange} value={formData.phone} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" onChange={handleChange} value={formData.password} />
          </FormControl>
          <Button type="submit" colorScheme="green" width="full">Register</Button>
          <Text fontSize="sm">
            Already have an account? <strong><a href="/buyer/login">Login</a></strong>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default BuyerRegister;
