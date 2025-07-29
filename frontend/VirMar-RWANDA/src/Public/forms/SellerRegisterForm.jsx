// Polished SellerRegisterForm.jsx with phone field
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
import { useSeller } from '../context/SellerContext';

const SellerRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { register } = useSeller();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await register(formData);
      toast({
        title: 'Registration successful.',
        description: "You're now registered! Please login.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      navigate('/seller/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred.',
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
      <Heading mb={6} textAlign="center">Seller Registration</Heading>
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
          <FormControl id="name" isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

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

          <FormControl id="phone" isInvalid={errors.phone}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              name="phone"
              placeholder="e.g. 0789123456"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl id="confirmPassword" isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isSubmitting}
            loadingText="Registering..."
            size="lg"
            fontWeight="bold"
          >
            Register
          </Button>

          <Text fontSize="sm" textAlign="center">
            Already have an account?{' '}
            <Link to="/seller/login" style={{ color: '#3182ce' }}>
              Login here
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SellerRegisterForm;
