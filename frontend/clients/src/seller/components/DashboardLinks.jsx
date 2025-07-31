import React from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  LinkBox,
  LinkOverlay,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  Package,
  Settings,
  Users,
  Truck,
  ClipboardList,
  MapPin,
  ShieldCheck,
  BellRing,
  HandCoins,
  // Shop
} from 'lucide-react';

const links = [
  {
    id: 1,
    title: 'Marketplace',
    // icon: Shop,
    href: '/seller/marketplace',
    description: 'See market conditions and buyer trends.',
  },
  {
    id: 2,
    title: 'Manage Account',
    icon: Package,
    href: '/seller/profile',
    description: 'Edit, remove or add account info.',
  },
  {
    id: 3,
    title: 'Orders',
    icon: ClipboardList,
    href: '/seller/orders',
    description: 'Track customer purchases and deliveries.',
  },
  {
    id: 4,
    title: 'Geolocation',
    icon: MapPin,
    href: '/seller/locate',
    description: 'Manage delivery areas and fees.',
  },
  {
    id: 5,
    title: 'Customers',
    icon: Users,
    href: '/seller/customers',
    description: 'View and manage your customer list.',
  },
  {
    id: 6,
    title: 'Deliveries',
    icon: Truck,
    href: '/seller/deliveries',
    description: 'Assign, verify and view delivery status.',
  },
  {
    id: 7,
    title: 'Escrow Status',
    icon: HandCoins,
    href: '/seller/escrow',
    description: 'Track release or hold of buyer payments.',
  },
  {
    id: 8,
    title: 'Trust & Security',
    icon: ShieldCheck,
    href: '/seller/trust-score',
    description: 'View your trust score and security settings.',
  },
  {
    id: 9,
    title: 'Notifications',
    icon: BellRing,
    href: '/seller/notifications',
    description: 'Check follower and system notifications.',
  },
  {
    id: 10,
    title: 'Settings',
    icon: Settings,
    href: '/seller/settings',
    description: 'Control your store preferences.',
  },
];

const DashboardLinks = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHover = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      w={{ base: '100%', md: '280px' }}
      bg={cardBg}
      p={4}
      rounded="lg"
      shadow="md"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Seller Services
      </Text>
      <VStack spacing={3} align="stretch">
        {links.map((link) => (
          <LinkBox
            key={link.id}
            as="article"
            p={3}
            rounded="md"
            borderWidth="1px"
            _hover={{ bg: cardHover }}
            transition="all 0.2s ease"
          >
            <Flex align="center">
              <Icon as={link.icon} boxSize={5} color="blue.500" mr={3} />
              <Box>
                <Text fontWeight="semibold" fontSize="sm">
                  <LinkOverlay href={link.href}>{link.title}</LinkOverlay>
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {link.description}
                </Text>
              </Box>
            </Flex>
          </LinkBox>
        ))}
      </VStack>
    </Box>
  );
};

export default DashboardLinks;
