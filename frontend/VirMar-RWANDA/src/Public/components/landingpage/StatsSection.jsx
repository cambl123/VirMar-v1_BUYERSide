import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiStar
} from 'react-icons/fi';

const StatCard = ({ title, stat, icon, helpText }) => (
  <Box
    px={8}
    py={5}
    shadow="xl"
    border="1px solid"
    borderColor={useColorModeValue('gray.200', 'gray.500')}
    rounded="lg"
    bg={useColorModeValue('white', 'gray.800')}
  >
    <Flex justify="space-between">
      <Box>
        <Text fontWeight="medium">{title}</Text>
        <Heading fontSize="2xl">{stat}</Heading>
        <Text>{helpText}</Text>
      </Box>
      <Box my="auto" color={useColorModeValue('gray.800', 'gray.200')}>
        {icon}
      </Box>
    </Flex>
  </Box>
);

const StatsSection = () => (
  <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
    <Container maxW="7xl">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
        <StatCard title="Total Sales" stat="$2.5M" icon={<FiTrendingUp size="3em" />} helpText="23% from last month" />
        <StatCard title="Active Sellers" stat="1,200" icon={<FiUsers size="3em" />} helpText="12% from last month" />
        <StatCard title="Products Listed" stat="15,000" icon={<FiShoppingBag size="3em" />} helpText="8% from last month" />
        <StatCard title="Customer Satisfaction" stat="4.9/5" icon={<FiStar size="3em" />} helpText="Based on 10k+ reviews" />
      </SimpleGrid>
    </Container>
  </Box>
);

export default StatsSection;
