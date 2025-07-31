import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Link as ChakraLink,
  useDisclosure,
  Stack,
  Text,
  Icon,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';

const navLinks = [
  { name: 'Dashboard', path: '/seller/dashboard', icon: FiHome },
  { name: 'Products', path: '/seller/products', icon: FiBox },
  { name: 'Orders', path: '/seller/orders', icon: FiShoppingCart },
  { name: 'Customers', path: '/seller/customers', icon: FiUsers },
  { name: 'Analytics', path: '/seller/analytics', icon: FiBarChart2 },
  { name: 'Notifications', path: '/seller/notifications', icon: FiBell },
  { name: 'Settings', path: '/seller/profile', icon: FiSettings },
];

const SellerNavbar = ({ onToggleSidebar }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // Handler for logout - replace with your auth logic
  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  // Active link style
  const activeLinkStyle = {
    fontWeight: 'bold',
    color: useColorModeValue('brand.600', 'brand.300'),
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      px={4}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="1200px" mx="auto">
        {/* Logo / Brand */}
        <Box>
          <ChakraLink
            as={Link}
            to="/seller/dashboard"
            fontSize="xl"
            fontWeight="bold"
            color={useColorModeValue('brand.600', 'brand.300')}
            _hover={{ textDecoration: 'none', color: useColorModeValue('brand.700', 'brand.400') }}
          >
            VirMar Seller
          </ChakraLink>
        </Box>

        {/* Desktop Nav Links */}
        <HStack spacing={8} alignItems="center" display={{ base: 'none', md: 'flex' }}>
          {navLinks.map(({ name, path, icon: IconComponent }) => (
            <ChakraLink
              key={name}
              as={NavLink}
              to={path}
              px={3}
              py={2}
              rounded="md"
              display="flex"
              alignItems="center"
              gap={2}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700'), textDecoration: 'none' }}
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            >
              <Icon as={IconComponent} />
              <Text>{name}</Text>
            </ChakraLink>
          ))}
        </HStack>

        <Spacer />

        {/* Mobile Menu Button */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Sidebar"
          display={{ md: 'none' }}
          onClick={onToggleSidebar} // Trigger drawer toggle from parent
        />

        {/* User Profile Menu */}
        <Menu>
          <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0} ml={4}>
            <Avatar
              size="sm"
              name="Seller User"
              src="https://bit.ly/broken-link" // Replace with seller's avatar URL
            />
          </MenuButton>
          <MenuList>
            <MenuItem as={Link} to="/seller/profile" icon={<FiSettings />}>
              Profile Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} icon={<FiLogOut />}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Mobile Menu Links (optional, can remove or keep) */}
    </Box>
  );
};

export default SellerNavbar;
