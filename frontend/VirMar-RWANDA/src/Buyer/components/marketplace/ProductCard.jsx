import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  HStack,
  Checkbox,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductCard = ({ product, onAddToCart }) => {
  const toast = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);

  const toggleWishlist = () => {
    // Ideally call backend to update wishlist here
    setIsWishlisted((prev) => !prev);
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      status: isWishlisted ? 'info' : 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleAddToCart = async () => {
    if (loadingCart) return;
    setLoadingCart(true);
    try {
      await onAddToCart(product._id);
      toast({
        title: 'Added to cart',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to add to cart',
        description: error.response?.data?.message || 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      boxShadow="sm"
      _hover={{ boxShadow: 'md' }}
      maxW="280px"
      p={4}
      role="group"
    >
      <Tooltip label={product.name}>
        <Image
          src={product.imageUrl || 'https://via.placeholder.com/280?text=No+Image'}
          alt={product.name}
          objectFit="cover"
          height="160px"
          width="100%"
          borderRadius="md"
          mb={3}
        />
      </Tooltip>

      <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={1}>
        {product.name}
      </Text>

      <Text fontSize="sm" color="gray.600" mb={1} noOfLines={1}>
        Seller: {product.seller_id?.name || 'Unknown'}
      </Text>

      <Badge colorScheme={product.status === 'available' ? 'green' : 'gray'} mb={2}>
        {product.status || 'Unknown'}
      </Badge>

      <HStack spacing={1} mb={3} aria-label={`Rating: ${product.rating || 0} out of 5`}>
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            color={i < (product.rating || 0) ? 'yellow.400' : 'gray.300'}
            boxSize={4}
          />
        ))}
      </HStack>

      <Text fontWeight="bold" fontSize="xl" mb={3}>
        {product.price?.reservedPrice
          ? `frw${product.price.reservedPrice.toLocaleString()}`
          : 'N/A'}
      </Text>

      <HStack justify="space-between">
        <Checkbox
          isChecked={isWishlisted}
          onChange={toggleWishlist}
          colorScheme="purple"
          size="md"
          aria-label="Toggle wishlist"
        >
          Wishlist
        </Checkbox>

        <Button
          colorScheme="blue"
          size="sm"
          onClick={handleAddToCart}
          isLoading={loadingCart}
          aria-label="Add to cart"
          isDisabled={product.status !== 'available'}
        >
          Add to Cart
        </Button>
      </HStack>
    </Box>
  );
};

export default ProductCard;
