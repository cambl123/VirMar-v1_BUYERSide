import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  HStack,
  Text,
  Button,
  Checkbox,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const ProductTable = ({ products, wishlist, toggleWishlist, handleAddToCart }) => {
  return (
    <Box overflowX="auto" borderRadius="lg" boxShadow="md">
      <Table variant="simple">
        <Thead bg="gray.100">
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Seller</Th>
            <Th>Reserved Price (frw)</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Wishlist</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => {
            const price = product.price || {};
            const reservedPrice = price?.reservedPrice ?? 'N/A';

            return (
              <Tr key={product._id} _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
                <Td>
                  <Avatar
                    size="md"
                    src={product.imageUrl || `https://via.placeholder.com/100?text=Product`}
                    name={product.name}
                    borderRadius="md"
                  />
                </Td>
                <Td fontWeight="medium">{product.name}</Td>
                <Td>
                  <Text color="blue.600" fontWeight="medium">
                    {product.seller_id?.name || 'Unknown'}
                  </Text>
                </Td>
                <Td>
                  <Text color="teal.600" fontWeight="bold">
                    {reservedPrice}
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
                  <Badge colorScheme={product.status === 'available' ? 'green' : 'gray'}>
                    {product.status || 'Unknown'}
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
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ProductTable;
