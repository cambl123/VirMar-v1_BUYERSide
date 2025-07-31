// src/buyer/components/dashboard/SummaryCards.jsx
import React from 'react';
import { SimpleGrid, Box, Text, Icon } from '@chakra-ui/react';
import { MdShoppingCart, MdAccountBalanceWallet, MdFavorite, MdSupportAgent } from 'react-icons/md';

const cardData = [
  { label: 'Orders', icon: MdShoppingCart, count: 12 },
  { label: 'Wallet', icon: MdAccountBalanceWallet, count: null },
  { label: 'Wishlist', icon: MdFavorite, count: 8 },
  { label: 'Support Tickets', icon: MdSupportAgent, count: 1 },
];

const SummaryCards = ({ walletBalance }) => {
  return (
    <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
      {cardData.map(({ label, icon, count }) => (
        <Box
          key={label}
          p={4}
          bg="gray.700"
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          color="white"
        >
          <Icon as={icon} boxSize={8} mb={2} color="teal.300" />
          <Text fontSize="lg" fontWeight="bold">
            {label}
          </Text>
          <Text fontSize="2xl" mt={1}>
            {label === 'Wallet' ? (walletBalance != null ? `${walletBalance} RWF` : 'N/A') : count}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default SummaryCards;
