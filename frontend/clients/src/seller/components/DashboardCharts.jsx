import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, useColorModeValue, Spinner, Center } from '@chakra-ui/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const DashboardCharts = () => {
  const bg = useColorModeValue('white', 'gray.900');

  const [storeId, setStoreId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchProfileAndItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get seller profile
        const profileRes = await axios.get('http://localhost:5000/api/seller/profile', { withCredentials: true });
        const seller = profileRes.data;
        if (!seller.store) throw new Error('No store found in seller profile');
        setStoreId(seller.store);

        // Get store items
        const itemsRes = await axios.get(`http://localhost:5000/api/seller/store/${seller.store}/items`, { withCredentials: true });
        setItems(itemsRes.data.items || []);

        // For now, let's assume the backend sends weekly sales data here
        // Replace this with a real API call when backend supports sales data
        // For example:
        // const salesRes = await axios.get(`http://localhost:5000/api/seller/store/${seller.store}/sales`);
        // setSalesData(salesRes.data.sales);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading data');
        setLoading(false);
      }
    };

    fetchProfileAndItems();
  }, []);

  // Generate product views data from actual items quantity
  const viewsData = items.map(item => ({
    product: item.name,
    views: item.quantity,
  }));

  if (loading)
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );

  if (error)
    return (
      <Box p={5} bg="red.100" color="red.700" borderRadius="md">
        Error: {error}
      </Box>
    );

  return (
    <Box bg={bg} p={5} rounded="md" shadow="sm" borderWidth="1px" w="100%">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Sales Overview (Weekly)
      </Text>
      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#3182ce" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Text fontSize="lg" fontWeight="bold" mt={10} mb={4}>
        Product Views (Quantity)
      </Text>
      <Box h="300px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={viewsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#38B2AC" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default DashboardCharts;
