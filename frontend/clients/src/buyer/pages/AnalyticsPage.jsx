import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const mockData = {
  totalSpent: 5000000,
  topProducts: [
    { name: 'iPhone 15 Pro Max', count: 3 },
    { name: 'MacBook Pro M3', count: 2 },
    { name: 'Samsung QLED TV', count: 1 },
  ],
  monthlySpending: [
    { month: 'Jan', amount: 1000000 },
    { month: 'Feb', amount: 1500000 },
    { month: 'Mar', amount: 2500000 },
  ],
};

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(mockData);

  useEffect(() => {
    // Fetch analytics data from the backend
    setAnalyticsData(mockData); // Replace with API call
  }, []);

  const spendingChartData = analyticsData.monthlySpending.map(item => ({
    name: item.month,
    spending: item.amount,
  }));

  return (
    <Box p={5}>
      <Heading as="h2" size="lg" mb={4}>Analytics</Heading>

      {/* Total Spending */}
      <SimpleGrid columns={3} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total Spent</StatLabel>
          <StatNumber>{analyticsData.totalSpent}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            15% increase from last month
          </StatHelpText>
        </Stat>

        {/* Top Products */}
        <Stat>
          <StatLabel>Top Products</StatLabel>
          {analyticsData.topProducts.map((product, index) => (
            <Text key={index}>{product.name}: {product.count} orders</Text>
          ))}
        </Stat>
      </SimpleGrid>

      {/* Spending over Time (Line Chart) */}
      <Heading size="md" mb={4}>Spending Over Time</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={spendingChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="spending" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AnalyticsPage;
