// src/buyer/components/BuyerNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Link as ChakraLink,
  Text,
  Icon,
  Button,
  Spacer,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  MdDashboard,
  MdPerson,
  MdAccountBalanceWallet,
  MdShoppingCart,
  MdFavorite,
  MdHistory,
  MdSearch,
  MdAnalytics,
  MdSupportAgent,
  MdHelpOutline,
  MdLogout,
} from 'react-icons/md';

const navItems = [
  { label: 'Dashboard', path: '/buyer/dashboard', icon: MdDashboard },
  { label: 'Profile', path: '/buyer/profile', icon: MdPerson },
  { label: 'Wallet', path: '/buyer/wallet', icon: MdAccountBalanceWallet },
  { label: 'Orders', path: '/buyer/orders', icon: MdShoppingCart },
  { label: 'Wishlist', path: '/buyer/wishlist', icon: MdFavorite },
  { label: 'History', path: '/buyer/history', icon: MdHistory },
  { label: 'Analytics', path: '/buyer/analytics', icon: MdAnalytics },
  { label: 'Search', path: '/buyer/search', icon: MdSearch },
  { label: 'Escrow', path: '/buyer/escrow', icon: MdAccountBalanceWallet },
  { label: 'Support', path: '/buyer/support', icon: MdSupportAgent },
  { label: 'FAQ', path: '/buyer/faq', icon: MdHelpOutline },
];

const BuyerNavbar = ({ onLogout }) => {
  const location = useLocation();

  // Determine stack direction based on screen size
  const stackDirection = useBreakpointValue({
    base: 'column',     // small screens: icon above text (but text hidden anyway)
    md: 'column',       // medium: icon above text
    lg: 'row',          // large: icon left, text right
  });

  // Show text or not based on breakpoint
  const showText = useBreakpointValue({
    base: false,   // hide text on base (small) screens
    md: true,      // show text on md and above
  });

  return (
    <Box
      bg="gray.800"
      px={6}
      py={3}
      color="white"
      boxShadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
      userSelect="none"
    >
      <Flex maxW="1200px" mx="auto" alignItems="center" minH="56px" wrap="nowrap">
        {/* Brand */}
        <Text
          fontWeight="bold"
          fontSize="xl"
          mr={8}
          whiteSpace="nowrap"
          flexShrink={0}
          display={{ base: 'none', md: 'block' }} // hide brand on small screens
        >
          VirMar Buyer
        </Text>

        {/* Nav Links */}
        <HStack
          spacing={6}
          flexGrow={1}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': { display: 'none' },
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}
        >
          {navItems.map(({ label, path, icon }) => {
            const isActive =
              location.pathname === path ||
              (path !== '/buyer/dashboard' && location.pathname.startsWith(path));

            return (
              <ChakraLink
                as={Link}
                to={path}
                key={path}
                px={2}
                py={1}
                borderRadius="md"
                bg={isActive ? 'blue.600' : 'transparent'}
                _hover={{ bg: 'blue.500', textDecoration: 'none' }}
                flexShrink={0}
                display="flex"
                flexDirection={stackDirection}
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                fontWeight={isActive ? 'semibold' : 'normal'}
                minW="56px"
                minH="56px"
              >
                <Icon as={icon} boxSize={6} />
                {showText && (
                  <Text fontSize="sm" mt={stackDirection === 'column' ? 1 : 0} ml={stackDirection === 'row' ? 2 : 0}>
                    {label}
                  </Text>
                )}
              </ChakraLink>
            );
          })}
        </HStack>

        {/* Spacer */}
        <Spacer />

        {/* Logout Button */}
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          onClick={onLogout}
          flexShrink={0}
          whiteSpace="nowrap"
          ml={4}
          display={{ base: 'none', md: 'inline-flex' }} // hide logout button on small screens
        >
          <Icon as={MdLogout} mr={1} />
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default BuyerNavbar;
