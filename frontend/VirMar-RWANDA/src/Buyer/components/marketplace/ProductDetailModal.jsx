import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Badge,
  VStack,
  HStack,
  Image,
  useToast,
} from '@chakra-ui/react';
import RatingStars from './RatingStars';

const statusColorScheme = {
  available: 'green',
  unavailable: 'red',
  pending: 'yellow',
};

const ProductDetailsModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await onAddToCart(product._id);
      toast({
        title: 'Added to cart',
        description: `${product.name} added to your cart.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Failed to add to cart',
        description: error.response?.data?.message || 'Try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4} textAlign="center">
            <Image
              src={product.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
              alt={product.name}
              maxH="300px"
              mx="auto"
              borderRadius="md"
              objectFit="contain"
            />
          </Box>

          <HStack justifyContent="space-between" mb={3}>
            <Text fontWeight="bold">Seller: {product.seller_id?.name || 'Unknown'}</Text>
            <Badge colorScheme={statusColorScheme[product.status] || 'gray'}>
              {product.status || 'Unknown'}
            </Badge>
          </HStack>

          <Text mb={3}>{product.description || 'No description available.'}</Text>

          <Text fontSize="lg" fontWeight="bold" mb={3}>
            Reserved Price: {product.price?.reservedPrice?.toLocaleString() || 'N/A'} RWF
          </Text>

          <VStack align="start" spacing={1} mb={4}>
            <Text>Rating:</Text>
            <RatingStars rating={product.rating || 0} />
          </VStack>

          {product.category && <Text mb={2}>Category: {product.category}</Text>}
          {product.stock !== undefined && <Text mb={2}>Stock: {product.stock}</Text>}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAddToCart}
            isLoading={loading}
            loadingText="Adding..."
            isDisabled={product.status !== 'available'}
          >
            Add to Cart
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailsModal;
