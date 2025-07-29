import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Spinner,
  Center,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { StarIcon } from '@chakra-ui/icons';
import ProductCard from './ProductCard';

const statusColor = {
  available: 'green',
  unavailable: 'red',
  pending: 'yellow',
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]); // store productIds in wishlist
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartId, setCartId] = useState(null);
  const toast = useToast();

  // Fetch products, buyer profile (for cart), and wishlist on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, buyerRes, wishlistRes] = await Promise.all([
          axios.get('http://localhost:5000/api/public/products'),
          axios.get('http://localhost:5000/api/buyer/profile', { withCredentials: true }),
          axios.get('http://localhost:5000/api/buyer/wishlist', { withCredentials: true }),
        ]);

        setProducts(productsRes.data.products || []);
        setCartId(buyerRes.data.buyer?.cart || null);
        setWishlist(wishlistRes.data.wishlist || []); // assuming backend returns array of productIds
      } catch (err) {
        setError('Failed to load products, buyer info, or wishlist.');
        toast({
          title: 'Error',
          description: 'Could not fetch required data.',
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

  // Add or remove from wishlist backend calls and update state
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.includes(productId);
    try {
      if (!isInWishlist) {
        // Add to wishlist
        await axios.post(
          'http://localhost:5000/api/buyer/wishlist',
          { productId },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, productId]);
        toast({ title: 'Added to wishlist', status: 'success', duration: 2000, isClosable: true });
      } else {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/buyer/wishlist/${productId}`, {
          withCredentials: true,
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast({ title: 'Removed from wishlist', status: 'info', duration: 2000, isClosable: true });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not update wishlist. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    if (!cartId) {
      throw new Error('Cart not found. Please refresh and try again.');
    }
    await axios.post(
      `http://localhost:5000/api/buyer/cart/${cartId}/item`,
      { productId, quantity: 1 },
      { withCredentials: true }
    );
  };

  if (loading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Center mt={20} color="red.500" fontWeight="bold">
        {error}
      </Center>
    );

  if (products.length === 0)
    return (
      <Center mt={20} color="gray.500" fontWeight="bold">
        No products available at the moment.
      </Center>
    );

  return (
    <Box p={6}>
      <Table variant="striped" size="md" mb={8}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Seller</Th>
            <Th>Reserved Price (frw)</Th>
            <Th>Status</Th>
            <Th>Rating</Th>
            <Th>Wishlist</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product._id}>
              <Td>{product.name}</Td>
              <Td>{product.seller_id?.name || 'Unknown'}</Td>
              <Td>
                {product.price?.reservedPrice
                  ? `frw${product.price.reservedPrice.toLocaleString()}`
                  : 'N/A'}
              </Td>
              <Td>
                <Badge colorScheme={statusColor[product.status] || 'gray'}>
                  {product.status || 'Unknown'}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={1}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < (product.rating || 0) ? 'yellow.400' : 'gray.300'}
                      boxSize={4}
                    />
                  ))}
                </HStack>
              </Td>
              <Td>
                {/* Wishlist toggle checkbox */}
                <input
                  type="checkbox"
                  checked={wishlist.includes(product._id)}
                  onChange={() => toggleWishlist(product._id)}
                  aria-label={`Toggle wishlist for ${product.name}`}
                />
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => setSelectedProduct(product)}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleAddToCart(product._id)}
                  isDisabled={product.status !== 'available'}
                >
                  Add to Cart
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Show product card + close button below table when selected */}
      {selectedProduct && (
        <Box mt={6}>
          <ProductCard
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            // Pass wishlist state and toggle handler so ProductCard can reflect it too
            isWishlisted={wishlist.includes(selectedProduct._id)}
            toggleWishlist={toggleWishlist}
          />
          <Button mt={3} onClick={() => setSelectedProduct(null)}>
            Close Details
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductList;
