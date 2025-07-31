// src/buyer/components/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  VStack,
  Badge,
} from '@chakra-ui/react';

// Mock data - replace with real fetch later
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1500000,
    seller: 'Apple Store Rwanda',
    category: 'Electronics',
    description:
      'The latest iPhone with amazing camera and performance.',
  },
  {
    id: '2',
    name: 'MacBook Pro 16" M3',
    price: 3200000,
    seller: 'Tech Hub Rwanda',
    category: 'Computers',
    description:
      'Powerful laptop for professionals and creatives.',
  },
  // Add more products here as needed
];

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch product by ID from backend API
    // Example: axios.get(`/api/products/${id}`).then(...)

    const foundProduct = mockProducts.find((p) => p.id === id);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [id]);

  if (loading) return <Spinner size="xl" mx="auto" mt={20} display="block" />;

  if (!product)
    return (
      <Box maxW="600px" mx="auto" mt={10} p={6} textAlign="center">
        <Heading size="md" mb={4}>
          Product not found
        </Heading>
        <Button as={Link} to="/buyer/search" colorScheme="blue">
          Back to Search
        </Button>
      </Box>
    );

  return (
    <Box maxW="700px" mx="auto" mt={10} p={6}>
      <Heading mb={4}>{product.name}</Heading>
      <Badge colorScheme="green" mb={2}>
        RWF {product.price.toLocaleString()}
      </Badge>
      <Text mb={2}>Seller: {product.seller}</Text>
      <Text mb={4}>Category: {product.category}</Text>
      <Text mb={6}>{product.description}</Text>
      <Button as={Link} to="/buyer/search" colorScheme="blue">
        Back to Search
      </Button>
    </Box>
  );
};

export default ProductDetailsPage;
