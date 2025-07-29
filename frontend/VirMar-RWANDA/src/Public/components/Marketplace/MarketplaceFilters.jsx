import React from 'react';
import {
  Box,
  SimpleGrid,
  Select,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

/**
 * Filters UI: category, location, max price, search, sorting
 */
const MarketplaceFilters = ({
  categories,
  locations,
  filters,
  onFilterChange,
  maxPrice,
}) => {
  return (
    <Box bg="white" p={6} rounded="md" boxShadow="md" mb={8}>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select
            placeholder="All categories"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Location</FormLabel>
          <Select
            placeholder="All locations"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          >
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Max Price: ₣{maxPrice}</FormLabel>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={maxPrice}
            onChange={(val) => onFilterChange('maxPrice', val)}
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="brand.500" />
            </SliderTrack>
            <SliderThumb boxSize={6} />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel>Sort By</FormLabel>
          <Select
            placeholder="Default"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
          </Select>
        </FormControl>
      </SimpleGrid>

      {/* Search bar */}
      <Box mt={6}>
        <Input
          placeholder="Search products by name..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
      </Box>
    </Box>
  );
};

export default MarketplaceFilters;
