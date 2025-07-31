// src/components/seller/marketplace/SummaryCards.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';

/**
 * SummaryCards Component
 *
 * Fetches and displays key marketplace metrics from backend.
 */
const SummaryCards = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:5000/public/market-summary');
        setData(res.data);
      } catch (err) {
        setError('Failed to load summary metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={8}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  const summaryData = [
    {
      label: 'Active Buyers',
      value: data.activeBuyers.toLocaleString(),
      helpText: data.growth.buyers,
    },
    {
      label: 'Total Orders',
      value: data.totalOrders.toLocaleString(),
      helpText: data.growth.orders,
    },
    {
      label: 'Sales Volume',
      value: `RWF ${data.salesVolume.toLocaleString()}`,
      helpText: data.growth.sales,
    },
    {
      label: 'Active Sellers',
      value: data.activeSellers.toLocaleString(),
      helpText: data.growth.sellers,
    },
    {
      label: 'Top Trending Category',
      value: data.topCategory,
      helpText: data.growth.category,
    },
  ];

  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={6}
      p={4}
      borderRadius="lg"
    >
      {summaryData.map((item, index) => (
        <Box
          key={index}
          bg={cardBg}
          p={5}
          shadow="md"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.200"
          _hover={{ transform: 'scale(1.02)', transition: '0.2s ease' }}
        >
          <Stat>
            <StatLabel fontSize="sm" color="gray.500">
              {item.label}
            </StatLabel>
            <StatNumber fontWeight="bold" fontSize="2xl">
              {item.value}
            </StatNumber>
            <StatHelpText fontSize="xs">{item.helpText}</StatHelpText>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default SummaryCards;
