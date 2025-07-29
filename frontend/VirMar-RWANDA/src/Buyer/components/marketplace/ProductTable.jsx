// src/buyer/components/marketplace/ProductTable.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Center,
  Avatar,
  Badge,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import ProductDetailsModal from './ProductDetailsModal';
import RatingStars from './RatingStars';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/public/products'); // update with actual endpoint
        setProducts(res.data.products || []);
      } catch (error) {
        toast({
          title: 'Failed to load products',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (products.length === 0) {
    return (
      <Center mt={20}>
        <Text>No products available.</Text>
      </Center>
    );
  }

  return (
    <Box overflowX="auto" maxW="100%" p={4}>
      <Table variant="simple" size="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Seller</Th>
            <Th>Price (RWF)</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product._id} _hover={{ bg: 'gray.50', cursor: 'pointer' }}>
              <Td>
                <Avatar
                  size="sm"
                  src={product.imageUrl || 'https://via.placeholder.com/100?text=Product'}
                  name={product.name}
                  borderRadius="md"
                />
              </Td>
              <Td>{product.name}</Td>
              <Td>{product.seller_id?.name || 'Unknown'}</Td>
              <Td>{product.price?.reservedPrice?.toLocaleString() || 'N/A'}</Td>
              <Td>
                <RatingStars rating={product.rating || 0} />
              </Td>
              <Td>
                <Badge colorScheme={product.status === 'available' ? 'green' : 'gray'}>
                  {product.status || 'Unknown'}
                </Badge>
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" onClick={() => openModal(product)}>
                  View Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={modalOpen}
          onClose={closeModal}
        />
      )}
    </Box>
  );
};

export default ProductTable;
