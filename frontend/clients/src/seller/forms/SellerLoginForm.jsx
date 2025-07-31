import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SellerLoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/seller/login',
        formData,
        { withCredentials: true }
      );

      // Optional: Save token if provided
      if (data.token) {
        localStorage.setItem('sellerToken', data.token);
      }

      toast({
        title: 'Login successful.',
        description: data.message || 'Welcome back!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      navigate('/seller/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed.',
        description:
          error.response?.data?.message || error.message || 'Invalid credentials.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} textAlign="center">
        Seller Login
      </Heading>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
          <FormControl id="email" isInvalid={errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              name="email"
              placeholder="your@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Logging in..."
            size="lg"
            fontWeight="bold"
          >
            Login
          </Button>

          <Text fontSize="sm" textAlign="center">
            Don't have an account?{' '}
            <Link to="/seller/register" style={{ color: '#3182ce' }}>
              Register here
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SellerLoginForm;
