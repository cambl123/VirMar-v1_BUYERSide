// src/seller/components/DashboardStats.jsx
import React from 'react';
import { Box, Flex, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue } from '@chakra-ui/react';
import { BarChart2, TrendingUp, ShoppingBag } from 'lucide-react';

const stats = [
  {
    label: 'Total Sales',
    value: '12.5M RWF',
    icon: <ShoppingBag size={28} />, // Will eventually come from backend
    helpText: '+18% from last month',
  },
  {
    label: 'Revenue Growth',
    value: '+8.2%',
    icon: <TrendingUp size={28} />,
    helpText: 'Monthly increase',
  },
  {
    label: 'Views',
    value: '5,430',
    icon: <BarChart2 size={28} />,
    helpText: 'From all products',
  },
];

const DashboardStats = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <Flex gap={6} wrap="wrap" justifyContent="space-between" bg={bg} p={5} rounded="md" shadow="sm">
      {stats.map((stat, index) => (
        <Box key={index} p={5} flex="1 1 200px" borderWidth="1px" borderRadius="lg" shadow="sm" bg="white">
          <Flex alignItems="center" gap={4} mb={2}>
            {stat.icon}
            <Stat>
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber>{stat.value}</StatNumber>
              <StatHelpText>{stat.helpText}</StatHelpText>
            </Stat>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
};

export default DashboardStats;
