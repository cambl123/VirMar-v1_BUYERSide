import React from 'react';
import { Input, Box } from '@chakra-ui/react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Box mb={4}>
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        size="md"
        focusBorderColor="teal.400"
        aria-label="Search products"
      />
    </Box>
  );
};

export default SearchBar;
