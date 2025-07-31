import React, { useEffect, useState } from 'react';
import { VStack, Heading, Spinner, Center } from '@chakra-ui/react';
import EscrowStatusCard from '../components/EscrowStatusCard';
import axios from 'axios';

const BuyerOrdersWithEscrow = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/buyer/orders", {
        withCredentials: true,
      });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Center><Spinner /></Center>;

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Heading size="lg">My Escrow Orders</Heading>
      {orders.map(order => (
        <EscrowStatusCard key={order._id} order={order} />
      ))}
    </VStack>
  );
};

export default BuyerOrdersWithEscrow;
