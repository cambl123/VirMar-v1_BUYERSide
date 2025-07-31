// src/seller/components/geolocation/MapView.jsx

import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const MapView = () => {
  return (
    <Box
      w="100%"
      h="400px"
      bg="gray.100"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text color="gray.500" fontSize="lg">
        MapView placeholder: Map will be rendered here when integrated with a Maps API.
      </Text>
    </Box>
  );
};

export default MapView;
