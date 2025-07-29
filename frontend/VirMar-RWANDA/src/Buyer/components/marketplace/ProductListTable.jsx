import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Button,
  Badge,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import RatingStars from './RatingStars';
import ProductDetailsModal from './ProductDetailsModal';
import SearchBar from './SearchBar';

const statusColorScheme = {
  available: 'green',
  unavailable: 'red',
  pending: 'yellow',
};

const ProductListTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/public/products');
        setProducts(res.data.products || []);
      } catch (err) {
        setError('Failed to load products. Please try again.');
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

  // Filter products by search term (case insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <Center mt={10}>
        <Spinner size="xl" color="teal.400" />
      </Center>
    );

  if (error)
    return (
      <Center mt={10}>
        <Text color="red.500">{error}</Text>
      </Center>
    );

  if (filteredProducts.length === 0)
    return (
      <Center mt={10}>
        <Text>No products match your search.</Text>
      </Center>
    );

  return (
    <Box overflowX="auto" maxW="100%" p={4}>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Table variant="simple" size="md">
        <Thead bg="gray.100">
          <Tr>
            <Th>Name</Th>
            <Th>Seller</Th>
            <Th>Reserved Price (RWF)</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredProducts.map((product) => (
            <Tr key={product._id}>
              <Td>{product.name}</Td>
              <Td>{product.seller_id?.name || 'Unknown'}</Td>
              <Td>{product.price?.reservedPrice?.toLocaleString() || 'N/A'}</Td>
              <Td>
                <RatingStars rating={product.rating || 0} />
              </Td>
              <Td>
                <Badge colorScheme={statusColorScheme[product.status] || 'gray'}>
                  {product.status || 'Unknown'}
                </Badge>
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" onClick={() => openModal(product)}>
                  View More
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
          onAddToCart={() => {
            // pass an onAddToCart handler here if needed, e.g. show toast or update cart
            // for demo, just a dummy promise:
            return Promise.resolve();
          }}
        />
      )}
    </Box>
  );
};

export default ProductListTable;
