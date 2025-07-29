import React from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Button,
  Tooltip,
} from '@chakra-ui/react';

/**
 * Product cards list display
 */
const ProductList = ({ products, onShowDetails }) => {
  if (!products.length) {
    return (
      <Text textAlign="center" mt={10} fontSize="lg" color="gray.600">
        No products found matching your criteria.
      </Text>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
      {products.map((p) => (
        <Box
          key={p._id}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          overflow="hidden"
          cursor="pointer"
          role="group"
          _hover={{ boxShadow: 'xl' }}
          onClick={() => onShowDetails(p)}
        >
          <Image
            src={p.img}
            alt={p.name}
            height="200px"
            width="100%"
            objectFit="cover"
            fallbackSrc="/products/default.png"
            loading="lazy"
          />

          <Stack p={4} spacing={2}>
            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
              {p.name}
            </Text>
            <Badge colorScheme={p.available ? 'green' : 'red'}>
              {p.available ? 'Available' : 'Unavailable'}
            </Badge>
            <Text color="brand.600" fontWeight="bold">
              {p.priceLabel}
            </Text>
            <Tooltip label={`Quantity: ${p.quantity}`} aria-label="quantity tooltip">
              <Text fontSize="sm" color="gray.500">
                Quantity: {p.quantity}
              </Text>
            </Tooltip>
            <Button
              mt={2}
              size="sm"
              colorScheme="brand"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // prevent parent onClick
                onShowDetails(p);
              }}
            >
              View Details
            </Button>
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default ProductList;
