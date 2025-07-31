// src/components/seller/marketplace/FiltersPanel.jsx

import React from 'react';
import {
  Box,
  Stack,
  Select,
  Input,
  Button,
  Heading,
} from '@chakra-ui/react';

/**
 * FiltersPanel Component
 *
 * Allows filtering marketplace data by date, category, location, etc.
 */
function FiltersPanel() {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      boxShadow="sm"
    >
      <Heading size="sm" mb={4}>Filter Insights</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <Select placeholder="Select Category">
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Groceries</option>
        </Select>
        <Input placeholder="Search by Location" />
        <Select placeholder="Sort by">
          <option>Most Recent</option>
          <option>Most Sold</option>
        </Select>
        <Button colorScheme="blue">Apply</Button>
      </Stack>
    </Box>
  );
}

export default FiltersPanel;
