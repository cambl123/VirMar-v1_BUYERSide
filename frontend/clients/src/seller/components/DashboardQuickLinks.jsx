// src/seller/components/DashboardLinks.jsx
import React from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Icon,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
} from '@chakra-ui/react';
import { Package, Settings, Users, Truck, ClipboardList } from 'lucide-react';

const links = [
  {
    id: 1,
    title: 'Manage Products',
    icon: Package,
    href: '/seller/products',
    description: 'Edit, remove or add new items.',
  },
  {
    id: 2,
    title: 'Orders',
    icon: ClipboardList,
    href: '/seller/orders',
    description: 'Track customer purchases and deliveries.',
  },
  {
    id: 3,
    title: 'Customers',
    icon: Users,
    href: '/seller/customers',
    description: 'View and manage your customer list.',
  },
  {
    id: 4,
    title: 'Deliveries',
    icon: Truck,
    href: '/seller/deliveries',
    description: 'Assign, verify and view delivery status.',
  },
  {
    id: 5,
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
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Seller Services
      </Text>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
        {links.map((link) => (
          <LinkBox
            key={link.id}
            as="article"
            p={5}
            rounded="md"
            shadow="sm"
            borderWidth="1px"
            bg={cardBg}
            _hover={{ bg: cardHover }}
            transition="background 0.2s ease-in-out"
          >
            <Icon as={link.icon} boxSize={6} mb={3} color="brand.500" />
            <Text fontWeight="bold" fontSize="md" mb={1}>
              <LinkOverlay href={link.href}>{link.title}</LinkOverlay>
            </Text>
            <Text fontSize="sm" color="gray.500">
              {link.description}
            </Text>
          </LinkBox>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DashboardLinks;
