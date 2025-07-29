import React from 'react';
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
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons';

// NavLink Component with active styling
const NavLink = ({ to, children, isActive }) => (
  <Box
    as={Link}
    to={to}
    px={3}
    py={2}
    rounded="md"
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

const LandingNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="7xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Mobile menu toggle */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
          />

          {/* Logo and nav links */}
          <HStack spacing={4} alignItems="center">
            {/* Logo */}
            <Box
              as={Link}
              to="/"
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: 'none' }}
            >
              <Box
                w={10}
                h={10}
                bgGradient="linear(to-br, brand.400, brand.600)"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize="md">
                  VM
                </Text>
              </Box>
              <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('gray.800', 'white')} ml={2}>
                VirMar
              </Text>
            </Box>

            {/* Desktop nav links */}
            <HStack spacing={2} display={{ base: 'none', md: 'flex' }} ml={5}>
              <NavLink to="/" isActive={isActive('/')}>
                Home
              </NavLink>
              <NavLink to="/marketplace" isActive={isActive('/marketplace')}>
                Marketplace
              </NavLink>
              <NavLink to="/categories" isActive={isActive('/categories')}>
                Categories
              </NavLink>
              <NavLink to="/about" isActive={isActive('/about')}>
                About
              </NavLink>
              <NavLink to="/contact" isActive={isActive('/contact')}>
                Contact
              </NavLink>
            </HStack>
          </HStack>

          {/* Right side: Search and auth buttons */}
          <Flex alignItems="center" gap={2}>
            <IconButton
              icon={<SearchIcon />}
              variant="ghost"
              aria-label="Search"
              size="md"
              // Optional: Add onClick to open a search modal here
            />

            <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
              <Button as={Link} to="/buyer/login" variant="ghost" size="sm">
                Sign In
              </Button>
              <Button as={Link} to="/buyer/register" size="sm" colorScheme="blue">
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Flex>

        {/* Mobile menu */}
        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack spacing={2}>
              <NavLink to="/" isActive={isActive('/')}>
                Home
              </NavLink>
              <NavLink to="/marketplace" isActive={isActive('/marketplace')}>
                Marketplace
              </NavLink>
              <NavLink to="/categories" isActive={isActive('/categories')}>
                Categories
              </NavLink>
              <NavLink to="/about" isActive={isActive('/about')}>
                About
              </NavLink>
              <NavLink to="/contact" isActive={isActive('/contact')}>
                Contact
              </NavLink>
              <Button as={Link} to="/buyer/login" variant="ghost" size="sm">
                Sign In
              </Button>
              <Button as={Link} to="/buyer/register" colorScheme="blue" size="sm">
                Get Started
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LandingNavbar;
