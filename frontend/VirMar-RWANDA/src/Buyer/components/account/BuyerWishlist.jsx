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
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Single Wishlist Item Component
const WishlistItem = ({ item, onRemove }) => (
  <Box
    p={4}
    borderWidth="1px"
    borderRadius="md"
    display="flex"
    justifyContent="space-between"
    alignItems="center"
  >
    <Box>
      <Link to={`/buyer/product/${item.productId}`}>
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
      <Button size="sm" colorScheme="red" onClick={() => onRemove(item.productId)}>
        Remove
      </Button>
    </HStack>
  </Box>
);

const BuyerWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/buyer/wishlist', {
          withCredentials: true,
        });
        // Assume response shape: { wishlist: [...] }
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load wishlist');
        toast({
          title: 'Error loading wishlist',
          description: err.response?.data?.message || err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [toast]);

  // Remove item from wishlist (backend + local update)
  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/buyer/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      toast({
        title: 'Removed from wishlist',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to remove item',
        description: err.response?.data?.message || err.message || 'Try again later',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading)
    return (
      <Spinner size="xl" mx="auto" mt={20} display="block" />
    );

  if (error)
    return (
      <Box maxW="600px" mx="auto" mt={10} p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );

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
    <Box maxW="700px" mx="auto" mt={10} p={6} overflowX={isMobile ? 'auto' : 'visible'}>
      <Heading mb={6}>My Wishlist</Heading>
      <VStack spacing={4} align="stretch">
        {wishlist.map((item) => (
          <WishlistItem key={item.productId} item={item} onRemove={removeFromWishlist} />
        ))}
      </VStack>
    </Box>
  );
};

export default BuyerWishlist;
