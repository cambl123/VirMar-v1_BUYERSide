// src/seller/components/geolocation/DeliveryFeesForm.jsx

import React, { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  HStack,
  Select,
  useToast,
} from '@chakra-ui/react';

// Simplified list of delivery areas (replace with real data or prop)
const sampleAreas = [
  'Kigali / Gasabo / Kimihurura / Cell A',
  'Kigali / Nyarugenge / Nyamirambo / Cell F',
  'Southern / Huye / Ngoma / Cell I',
];

const DeliveryFeesForm = () => {
  const toast = useToast();
  const [feesData, setFeesData] = useState(
    sampleAreas.reduce((acc, area) => {
      acc[area] = '';
      return acc;
    }, {})
  );

  const handleFeeChange = (area) => (e) => {
    const value = e.target.value;
    setFeesData((prev) => ({ ...prev, [area]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate fees are numeric and positive
    for (const [area, fee] of Object.entries(feesData)) {
      if (!fee || isNaN(fee) || Number(fee) < 0) {
        toast({
          title: 'Invalid fee value',
          description: `Please enter a valid positive number for "${area}".`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    // TODO: Submit feesData to backend
    console.log('Submitting delivery fees:', feesData);
    toast({
      title: 'Delivery fees saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="700px" mx="auto" p={6} bg="white" boxShadow="md" rounded="md" mt={8}>
      <Heading size="md" mb={4}>
        Set Delivery Fees by Area
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {sampleAreas.map((area) => (
            <FormControl key={area} id={`fee-${area}`} isRequired>
              <FormLabel>{area}</FormLabel>
              <Input
                type="number"
                placeholder="Enter delivery fee (e.g., 2000)"
                value={feesData[area]}
                onChange={handleFeeChange(area)}
                min={0}
              />
            </FormControl>
          ))}

          <Button type="submit" colorScheme="blue" mt={4}>
            Save Fees
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default DeliveryFeesForm;
