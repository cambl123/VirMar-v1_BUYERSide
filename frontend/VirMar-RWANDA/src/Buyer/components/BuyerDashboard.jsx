import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';

// Import smaller components from ./dashboard/
import BuyerNavbar from './dashboard/BuyerNavbar';
import ProductTable from './dashboard/ProductTable';
import AssistantWidget from './dashboard/AssistantWidget';

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
        // Fetch products list from public API
        const productsRes = await fetch('http://localhost:5000/api/public/');
        const productsData = await productsRes.json();

        // Fetch buyer profile including wallet and cart info
        const buyerRes = await fetch('http://localhost:5000/api/buyer/profile', {
          credentials: 'include', // send cookies for authentication
        });
        const buyerData = await buyerRes.json();

        setProducts(productsData.product || []);
        setBuyer(buyerData.buyer || {});
        setCartId(buyerData.buyer?.cart || null);
      } catch (err) {
        console.error('Failed to load data:', err);
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
  }, [toast]);

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
      // Send POST request to add product to cart
      const res = await fetch(
        `http://localhost:5000/api/buyer/cart/${cartId}/item`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: 1 }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }

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
        description: error.message,
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
        Welcome back,{' '}
        <Text as="span" color="teal.500">
          {buyer.name || 'Buyer'}!
        </Text>
      </Heading>

      <Text fontSize="md" mb={6}>
        Wallet Balance:{' '}
        <Text as="span" color="green.500" fontWeight="bold">
          { buyer.walletBalance ? `frw${buyer.walletBalance} RWF` : 'N/A'}
        </Text>
      </Text>

      {loading ? (
        <Center mt={10}>
          <Spinner size="xl" thickness="4px" color="teal.400" />
        </Center>
      ) : error ? (
        <Center color="red.500">{error}</Center>
      ) : (
        <ProductTable
          products={products}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          handleAddToCart={handleAddToCart}
        />
      )}

      <AssistantWidget />
    </Box>
  );
};

export default BuyerDashboard;
