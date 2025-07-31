import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Select,
  Button,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import ProductCard from './ProductCard'; // your existing card component

// Mock products - replace with backend API fetch
const mockProducts = [/* your product data here or import */];

const categories = ['All', 'Electronics', 'Fashion', 'Vehicles', 'Computers'];

const AdvancedProductSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterAndSort = () => {
    setLoading(true);

    // Simulate backend filtering
    let filtered = mockProducts.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Simple sorting example
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      // Assume newest have highest id
      filtered.sort((a, b) => b.id - a.id);
    }

    setTimeout(() => { // simulate loading delay
      setResults(filtered);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    filterAndSort();
  }, [searchTerm, category, sortBy]);

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <VStack spacing={4} align="start">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="400px"
        />
        <HStack spacing={4}>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} maxW="200px">
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} maxW="200px">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </Select>
          <Button onClick={filterAndSort}>Search</Button>
        </HStack>

        {loading ? (
          <Spinner size="xl" />
        ) : results.length === 0 ? (
          <Text>No products found.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} width="100%">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default AdvancedProductSearch;
