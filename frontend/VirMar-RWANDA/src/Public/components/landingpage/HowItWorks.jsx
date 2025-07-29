import React from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Icon,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FiSearch,
  FiShield,
  FiTruck,
  FiThumbsUp
} from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    { icon: FiSearch, title: 'Discover Products', description: 'Browse a wide variety of products from verified sellers.' },
    { icon: FiShield, title: 'Secure Escrow Payment', description: 'Your payment is safely held until you confirm delivery.' },
    { icon: FiTruck, title: 'Fast & Reliable Delivery', description: 'Track your orders and get deliveries on time.' },
    { icon: FiThumbsUp, title: 'Rate & Build Trust', description: 'Leave ratings to help build a trustworthy community.' }
  ];

  return (
    <Box py={16} px={4} bg={useColorModeValue('gray.50', 'gray.700')}>
      <Heading textAlign="center" mb={12} fontSize="3xl" fontWeight="bold">
        How VirMar Works
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} maxW="7xl" mx="auto">
        {steps.map(({ icon, title, description }, idx) => (
          <VStack key={idx} spacing={4} textAlign="center" px={4}>
            <Box
              bg="brand.500"
              color="white"
              p={5}
              rounded="full"
              fontSize="3xl"
              boxShadow="md"
            >
              <Icon as={icon} />
            </Box>
            <Text fontWeight="bold" fontSize="lg">{title}</Text>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default HowItWorks;
