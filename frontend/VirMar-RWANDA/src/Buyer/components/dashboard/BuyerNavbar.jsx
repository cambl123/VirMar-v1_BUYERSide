import React from 'react';
import { Box, Flex, Link, Spacer, Avatar, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const navLinks = [
  { name: 'Dashboard', to: '/buyer/dashboard' },
  { name: 'Orders', to: '/buyer/orders' },
  { name: 'Escrow Flow', to: '/buyer/escrow-flow' },
  { name: 'Escrow Help', to: '/buyer/escrow-help' },
  { name: 'Wishlist', to: '/buyer/wishlist' },
  { name: 'Wallet', to: '/buyer/wallet' },
  { name: 'Profile', to: '/buyer/profile' },
];

const BuyerNavbar = () => {
  return (
    <Box bg="blue.600" color="white" px={6} py={3} boxShadow="md">
      <Flex align="center">
        <Text fontSize="xl" fontWeight="bold">
          VirMar Buyer
        </Text>
        <Spacer />
        <Flex gap={4}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              as={RouterLink}
              to={link.to}
              _hover={{ textDecoration: 'underline' }}
              fontWeight="medium"
            >
              {link.name}
            </Link>
          ))}
        </Flex>
        <Spacer />
        <Avatar size="sm" name="Buyer" />
      </Flex>
    </Box>
  );
};

export default BuyerNavbar;
