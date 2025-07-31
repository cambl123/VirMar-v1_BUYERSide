import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Spinner,
  useToast,
  Center,
  HStack,
  Button,
  Checkbox,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import axios from 'axios';
import BuyerNavbar from './BuyerNavBar';
import AssistantWidget from "../VirtualAssistant/AssistantWadget";

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [buyer, setBuyer] = useState({ name: 'Camble 👋', walletBalance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const [wishlist, setWishlist] = useState({});
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, buyerRes] = await Promise.all([
          axios.get('http://localhost:5000/api/public/'),
          axios.get('http://localhost:5000/api/buyer/profile', { withCredentials: true }),
        ]);

        setProducts(productsRes.data.products || []);
        setBuyer(buyerRes.data.buyer || {});
        setCartId(buyerRes.data.buyer.cart);
      } catch (err) {
        console.error(err);
        setError('Failed to load data. Please try again.');
        toast({
          title: 'Error',
          description: 'Could not fetch buyer data or products.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!cartId) {
      toast({
        title: 'Cart not found.',
        description: 'Please refresh the page or try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/buyer/cart/${cartId}/item`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );

      toast({
        title: 'Item added to cart.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: 'Failed to add to cart.',
        description: error.response?.data?.message || 'Try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box p={6}>
      <BuyerNavbar />
      <Heading size="lg" mb={4}>
        Welcome back, <Text as="span" color="teal.500">{buyer.name || 'Buyer'}!</Text>
      </Heading>

      <Text fontSize="md" mb={6}>
        Wallet Balance:{' '}
        <Text as="span" color="green.500" fontWeight="bold">
          {buyer.walletBalance ? `frw ${buyer.walletBalance} RWF` : 'N/A'}
        </Text>
      </Text>

      <Heading size="md" mb={3}>Available Products</Heading>

      {loading ? (
        <Center mt={10}>
          <Spinner size="xl" thickness="4px" color="teal.400" />
        </Center>
      ) : error ? (
        <Center color="red.500">{error}</Center>
      ) : products.length === 0 ? (
        <Center mt={6} color="gray.500">No products available at the moment.</Center>
      ) : (
        <Box overflowX="auto" borderRadius="lg" boxShadow="md">
          <Table variant="simple">
            <Thead bg="gray.100">
              <Tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Seller</Th>
                <Th>Price</Th>
                <Th>Rating</Th>
                <Th>Status</Th>
                <Th>Wishlist</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product._id} _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
                  <Td>
                    <Avatar
                      size="md"
                      src={product.img || `https://via.placeholder.com/100?text=Product`}
                      name={product.name}
                      borderRadius="md"
                    />
                  </Td>
                  <Td fontWeight="medium">{product.name}</Td>
                  <Td>
                    <Text color="blue.600" fontWeight="medium">
                      {product.seller?.name || 'Unknown'}
                    </Text>
                  </Td>
                  <Td>
                    <Text color="teal.600" fontWeight="bold">
                      {product.priceLabel || '₣0'}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      {Array(5)
                        .fill('')
                        .map((_, i) => (
                          <StarIcon
                            key={i}
                            color={i < (product.rating || 0) ? 'yellow.400' : 'gray.300'}
                          />
                        ))}
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={product.available ? 'green' : 'gray'}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={wishlist[product._id] || false}
                      onChange={() => toggleWishlist(product._id)}
                      colorScheme="purple"
                    >
                      Save
                    </Checkbox>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      Add to Cart
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <AssistantWidget />
    </Box>
  );
};

export default BuyerDashboard;
