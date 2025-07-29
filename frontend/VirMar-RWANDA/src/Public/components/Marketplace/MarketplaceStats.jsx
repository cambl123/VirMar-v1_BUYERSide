import React from 'react';
import { SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Box } from '@chakra-ui/react';

/**
 * Marketplace statistics section showing key market figures
 */
const MarketplaceStats = ({ stats }) => (
  <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={10}>
    {stats.map((stat, i) => (
      <Stat key={i} p={5} bg="white" boxShadow="sm" borderRadius="lg" textAlign="center">
        <StatLabel>{stat.label}</StatLabel>
        <StatNumber fontSize="2xl">{stat.value}</StatNumber>
        <StatHelpText>{stat.helpText}</StatHelpText>
      </Stat>
    ))}
  </SimpleGrid>
);

export default MarketplaceStats;
