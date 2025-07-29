import React, { useState } from 'react';
import {
  Box,
  HStack,
  Input,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const ProductSearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/buyer/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <Box maxW="7xl" mx="auto" p={6} rounded="lg" boxShadow="md" mb={12} bg={useColorModeValue('white', 'gray.700')}>
      <HStack maxW="600px" mx="auto">
        <Input
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          bg={useColorModeValue('gray.100', 'gray.600')}
        />
        <Button colorScheme="brand" size="lg" onClick={handleSearch} leftIcon={<FiSearch />}>
          Search
        </Button>
      </HStack>
    </Box>
  );
};

export default ProductSearchBar;
