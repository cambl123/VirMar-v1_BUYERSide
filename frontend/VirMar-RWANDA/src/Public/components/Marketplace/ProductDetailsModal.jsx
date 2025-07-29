import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Text,
  Badge,
  Stack,
  Box,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

/**
 * Modal to display selected product details
 */
const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{product.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
            <Box flex="1">
              <Image
                src={product.img}
                alt={product.name}
                borderRadius="md"
                maxH="300px"
                objectFit="cover"
                fallbackSrc="/products/default.png"
                loading="lazy"
              />
            </Box>
            <Box flex="2">
              <Stack spacing={4}>
                <Text fontSize="xl" fontWeight="bold" color="brand.600">
                  Price: {product.priceLabel}
                </Text>
                <Badge colorScheme={product.available ? 'green' : 'red'} fontSize="md" width="fit-content">
                  {product.available ? 'Available' : 'Unavailable'}
                </Badge>
                <Text>Category: {product.category}</Text>
                <Text>Location: {product.location}</Text>
                <Text>Quantity Available: {product.quantity}</Text>

                <Button colorScheme="brand" mt={4} onClick={() => alert('Add to cart functionality pending')}>
                  Add to Cart
                </Button>
              </Stack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailsModal;
