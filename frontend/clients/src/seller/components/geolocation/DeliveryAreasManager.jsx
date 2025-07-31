// src/seller/components/geolocation/DeliveryAreasManager.jsx

import React, { useState } from 'react';
import { Box, Button, Heading, VStack, List, ListItem, Text, HStack, useToast } from '@chakra-ui/react';
import AreaSelector from './AreaSelector';

/**
 * DeliveryAreasManager
 * Sellers add and manage delivery areas.
 */
const DeliveryAreasManager = () => {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    province: '',
    district: '',
    sector: '',
    cell: '',
  });

  const toast = useToast();

  // Add selected area to list
  const addArea = () => {
    const { province, district, sector, cell } = currentSelection;
    if (!province || !district || !sector || !cell) {
      toast({
        title: 'Incomplete selection',
        description: 'Please select all levels: province, district, sector, and cell.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check for duplicates
    const areaString = `${province} / ${district} / ${sector} / ${cell}`;
    if (selectedAreas.includes(areaString)) {
      toast({
        title: 'Area exists',
        description: 'You have already added this delivery area.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedAreas((prev) => [...prev, areaString]);
    setCurrentSelection({ province: '', district: '', sector: '', cell: '' });
  };

  // Remove area from list
  const removeArea = (area) => {
    setSelectedAreas((prev) => prev.filter((a) => a !== area));
  };

  return (
    <Box maxW="700px" mx="auto" p={6} bg="white" boxShadow="md" rounded="md">
      <Heading size="md" mb={4}>Manage Delivery Areas</Heading>

      <AreaSelector
        selection={currentSelection}
        setSelection={setCurrentSelection}
      />

      <Button mt={4} colorScheme="blue" onClick={addArea}>
        Add Delivery Area
      </Button>

      <Box mt={6}>
        <Heading size="sm" mb={2}>Your Delivery Areas:</Heading>
        {selectedAreas.length === 0 ? (
          <Text color="gray.500">No delivery areas added yet.</Text>
        ) : (
          <List spacing={2}>
            {selectedAreas.map((area) => (
              <ListItem key={area} p={2} borderWidth="1px" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                <Text>{area}</Text>
                <Button size="sm" colorScheme="red" onClick={() => removeArea(area)}>Remove</Button>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default DeliveryAreasManager;
