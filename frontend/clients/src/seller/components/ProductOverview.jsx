// src/seller/components/ProductOverview.jsx
import React from 'react';
import { Box, SimpleGrid, Heading } from '@chakra-ui/react';
import ProductCard from '../../components/ProductCard'; // Assuming you already have this component

const mockProducts = [
  {
    id: 1,
    name: 'Iphone 15 pro',
    price: '1,500,000',
    imageUrl: 'https://via.placeholder.com/150',
    seller: 'Apple Inc.',
    rating: 4,
    reviewCount: 34,
  },
  {
    id: 2,
    name: 'Jeep Wrangler',
    price: '80,000,000',
    imageUrl: 'https://via.placeholder.com/150',
    seller: 'Jeep',
    rating: 5,
    reviewCount: 12,
  },
];

const ProductOverview = () => {
  return (
    <Box>
      <Heading size="lg" mb={4}>Your Products</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="10">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductOverview;
