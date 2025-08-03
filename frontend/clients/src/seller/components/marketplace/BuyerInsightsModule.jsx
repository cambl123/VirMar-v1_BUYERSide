// src/components/seller/marketplace/BuyerInsightsModule.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Progress,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../../configs/api.config'; // Adjust the import path as necessary

const BuyerInsightsModule = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBuyerInsights = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/seller/analytics/buyer-insights`,
          { withCredentials: true }
        );

        if (Array.isArray(response.data.data)) {
          setInsights(response.data.data);
        } else {
          throw new Error('Unexpected data format from server.');
        }
      } catch (error) {
        console.error('Error fetching buyer insights:', error.message);
        toast({
          title: 'Error loading insights',
          description: error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerInsights();
  }, [toast]);

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="lg"
      boxShadow="md"
      borderWidth={1}
      mb={4}
    >
      <Heading size="md" mb={4}>Buyer Insights</Heading>

      {loading ? (
        <Center>
          <Spinner size="lg" color="green.500" />
        </Center>
      ) : (
        <VStack spacing={3} align="stretch">
          {insights.length > 0 ? (
            insights.map((item, i) => (
              <Box key={i}>
                <Text fontWeight="semibold">{item.label}</Text>
                <Progress value={item.value} colorScheme="green" borderRadius="sm" />
                <Text fontSize="sm" color="gray.500">{item.value}%</Text>
              </Box>
            ))
          ) : (
            <Text color="gray.500">No buyer insights available.</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default BuyerInsightsModule;