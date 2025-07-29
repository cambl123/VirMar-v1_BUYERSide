import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid, 
  VStack,
  Avatar,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaLightbulb, FaUsers, FaHandshake } from 'react-icons/fa';
import './css/about'
import Navbar from './Marketplace/Navbar';
import Footer from './Marketplace/Footer';

// Team member data - can be expanded later
const teamMembers = [
  {
    name: 'Camble Isaac',
    role: 'Founder & CEO',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
  },
];

// Core values to display with icons, titles, and descriptions
const coreValues = [
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'We continuously innovate to bring the best digital marketplace experience.',
  },
  {
    icon: FaUsers,
    title: 'Community',
    description: 'Building a strong and trustworthy community of buyers and sellers.',
  },
  {
    icon: FaHandshake,
    title: 'Trust',
    description: 'Trust and transparency are at the heart of everything we do.',
  },
];

const AboutUs = () => {
  // Color mode aware background and text colors
  const bg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <Box bg={bg} minH="100vh">
      {/* Navbar component */}
      <Navbar />

      {/* Main content container */}
      <Container maxW="6xl" py={16} px={6}>
        {/* Page main heading */}
        <Heading
          as="h1"
          size="3xl"
          textAlign="center"
          mb={8}
          fontWeight="extrabold"
          color="teal.600"
        >
          About VirMar
        </Heading>

        {/* Introductory paragraph */}
        <Text fontSize="xl" color={textColor} maxW="3xl" mx="auto" mb={16} textAlign="center">
          VirMar is Rwanda’s first virtual market which is Camble’s first invention marketplace built with love and technology to
          empower buyers and sellers across the country. We strive to bring transparency,
          ease, and innovation to everyday commerce.
        </Text>

        {/* Core values grid */}
        <SimpleGrid columns={[1, null, 3]} spacing={10} mb={20}>
          {coreValues.map(({ icon, title, description }) => (
            <VStack
              key={title}
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              rounded="xl"
              shadow="md"
              textAlign="center"
              spacing={4}
              role="group" // for accessibility if needed
            >
              {/* Icon */}
              <Icon as={icon} w={12} h={12} color="teal.400" aria-hidden="true" />
              {/* Value title */}
              <Heading as="h3" size="lg" color="teal.600">
                {title}
              </Heading>
              {/* Description */}
              <Text color={textColor}>{description}</Text>
            </VStack>
          ))}
        </SimpleGrid>

        {/* Creator section */}
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="2xl" mb={4} color="teal.600">
            Meet Our Creator
          </Heading>
          <Text color={textColor} maxW="2xl" mx="auto" fontSize="lg">
            A passionate school boy dedicated to building the best marketplace experience
            for Rwanda.
          </Text>
        </Box>

        {/* Team members grid */}
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {teamMembers.map(({ name, role, imageUrl }) => (
            <VStack
              key={name}
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              rounded="xl"
              shadow="md"
              spacing={4}
              textAlign="center"
              transition="all 0.3s ease"
              _hover={{ transform: 'scale(1.05)', shadow: 'lg' }}
            >
              {/* Avatar with lazy loading */}
              <Avatar 
                size="xl" 
                src={imageUrl} 
                name={name} 
                imgProps={{ loading: 'lazy' }} 
              />
              <Heading as="h3" size="md" color="teal.600">
                {name}
              </Heading>
              <Text color={textColor}>{role}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Container>

      {/* Footer component */}
      <Footer />
    </Box>
  );
};

export default AboutUs;
