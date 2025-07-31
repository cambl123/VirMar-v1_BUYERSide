// src/buyer/components/BuyerWishlist.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  useToast,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

// Mock wishlist data (replace with API data later)
const mockWishlist = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 1500000,
    seller: 'Apple Store Rwanda',
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'Nike Air Jordan 1',
    price: 180000,
    seller: 'Sneaker World',
    category: 'Fashion',
  },
];

const BuyerWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // TODO: fetch wishlist from backend
    setWishlist(mockWishlist);
    setLoading(false);
  }, []);

  const removeFromWishlist = (id) => {
    // TODO: call backend to remove item
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: 'Removed from wishlist',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  if (loading) return <Spinner size="xl" mx="auto" mt={20} display="block" />;

  if (wishlist.length === 0)
    return (
      <Box maxW="600px" mx="auto" mt={10} p={6} textAlign="center">
        <Heading size="md" mb={4}>
          Your wishlist is empty
        </Heading>
        <Text>Start adding your favorite products!</Text>
      </Box>
    );

  return (
    <Box maxW="700px" mx="auto" mt={10} p={6}>
      <Heading mb={6}>My Wishlist</Heading>
      <VStack spacing={4} align="stretch">
        {wishlist.map((item) => (
          <Box
            key={item.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Link to={`/buyer/product/${item.id}`}>
                <Text fontWeight="bold">{item.name}</Text>
              </Link>
              <Text fontSize="sm" color="gray.600">
                Seller: {item.seller} | Category: {item.category}
              </Text>
            </Box>
            <HStack spacing={6} align="center">
              <Badge colorScheme="green" fontSize="sm">
                RWF {item.price.toLocaleString()}
              </Badge>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default BuyerWishlist;
