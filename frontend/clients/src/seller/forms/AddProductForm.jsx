import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      console.log('Form data submitted:', formData);
      setIsLoading(false);
      toast({
        title: 'Product added.',
        description: "We've added your product for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/seller/dashboard');
    }, 2000);
  };

  return (
    <Box p={5}>
      <Heading as="h1" mb={5}>
        Add a New Product
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Product Name</FormLabel>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="description" mt={4} isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="price" mt={4} isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="imageUrl" mt={4} isRequired>
          <FormLabel>Image URL</FormLabel>
          <Input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isLoading}
          type="submit"
        >
          Add Product
        </Button>
      </form>
    </Box>
  );
};

export default AddProductForm;