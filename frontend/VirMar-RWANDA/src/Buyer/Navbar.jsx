import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Container,
  Badge,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { FiShoppingCart, FiHeart, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

// NavLink Component
const NavLink = ({ to, children, isActive }) => (
  <Box
    as={Link}
    to={to}
    px={3}
    py={2}
    rounded={'md'}
    fontWeight={isActive ? 'bold' : 'medium'}
    color={isActive ? 'brand.600' : 'gray.600'}
    _hover={{
      bg: 'gray.100',
      color: 'brand.700',
      transform: 'translateY(-1px)',
    }}
    transition="all 0.2s"
    bg={isActive ? 'gray.100' : 'transparent'}
  >
    {children}
  </Box>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY && currentY > 100) {
        setScrollDirection('down'); // Hide
      } else {
        setScrollDirection('up'); // Show
      }

      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      transition="all 0.3s ease-in-out"
      transform={scrollDirection === 'down' ? 'translateY(-100%)' : 'translateY(0)'}
      bg="rgba(255,255,255,0.9)"
      backdropFilter="blur(10px)"
      borderBottom="1px solid #e2e8f0"
      shadow="sm"
    >
      <Container maxW="7xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Mobile Toggle */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />

          {/* Logo */}
          <HStack spacing={4}>
            <Box as={Link} to="/" _hover={{ textDecoration: 'none' }} display="flex" alignItems="center">
              <Box
                w={10}
                h={10}
                bgGradient="linear(to-br, brand.400, brand.600)"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="md">VM</Text>
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.800" ml={2}>VirMar</Text>
            </Box>

            {/* Nav Links (Desktop) */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }} ml={5}>
              <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
              <NavLink to="/marketplace" isActive={isActive('/marketplace')}>Marketplace</NavLink>
              <NavLink to="/categories" isActive={isActive('/categories')}>Categories</NavLink>
              <NavLink to="/about" isActive={isActive('/about')}>About</NavLink>
              <NavLink to="/contact" isActive={isActive('/contact')}>Contact</NavLink>
            </HStack>
          </HStack>

          {/* Right Actions */}
          <Flex alignItems="center" gap={2}>
            {/* Icons */}
            <IconButton icon={<SearchIcon />} variant="ghost" aria-label="Search" />
            <IconButton icon={<FiHeart />} variant="ghost" aria-label="Wishlist" />
            <Box position="relative">
              <IconButton icon={<FiShoppingCart />} variant="ghost" aria-label="Cart" />
              <Badge position="absolute" top="-1" right="-1" colorScheme="red" borderRadius="full" fontSize="xs" px={2}>
                3
              </Badge>
            </Box>
            <Box position="relative">
              <IconButton icon={<BellIcon />} variant="ghost" aria-label="Notifications" />
              <Badge position="absolute" top="-1" right="-1" colorScheme="blue" borderRadius="full" fontSize="xs" px={2}>
                2
              </Badge>
            </Box>

            {/* Auth (Change to auth state later) */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Button as={Link} to="/buyer/login" variant="ghost" size="sm">Sign In</Button>
              <Button as={Link} to="/buyer/register" size="sm" colorScheme="blue">Get Started</Button>
            </HStack>

            {/* Authenticated User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="link"
                cursor="pointer"
                minW={0}
                display="none" // Set to flex if user is authenticated
              >
                <HStack>
                  <Avatar size="sm" src="https://bit.ly/sage-adebayo" />
                  <ChevronDownIcon />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUser />}>Profile</MenuItem>
                <MenuItem icon={<FiSettings />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Mobile Nav */}
        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack spacing={2}>
              <NavLink to="/" isActive={isActive('/')}>Home</NavLink>
              <NavLink to="/marketplace" isActive={isActive('/marketplace')}>Marketplace</NavLink>
              <NavLink to="/categories" isActive={isActive('/categories')}>Categories</NavLink>
              <NavLink to="/about" isActive={isActive('/about')}>About</NavLink>
              <NavLink to="/contact" isActive={isActive('/contact')}>Contact</NavLink>
              <Button as={Link} to="/buyer/login" variant="ghost" size="sm">Sign In</Button>
              <Button as={Link} to="/buyer/register" colorScheme="blue" size="sm">Get Started</Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Navbar;
