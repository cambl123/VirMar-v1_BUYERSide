import React from 'react';
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiTrendingUp,
} from 'react-icons/fi';

const MotionBox = motion(Box);

const HeroSection = () => {
  return (
    <Container maxW={'7xl'} py={20}>
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Heading lineHeight={1.1} fontWeight={700} fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
              <Text as={'span'}>The Future of</Text><br />
              <Text as={'span'} color={'brand.600'}>Digital Commerce</Text>
            </Heading>
          </MotionBox>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Text color={'gray.500'} fontSize={'xl'} maxW={'3xl'}>
              Join Rwanda&apos;s most trusted marketplace where innovation meets security.
              Connect with verified sellers, discover unique products, and experience seamless transactions with our advanced escrow system.
            </Text>
          </MotionBox>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
              <Button as={Link} to="/buyer/register" size={'lg'} fontWeight={'600'} px={8} colorScheme={'brand'} leftIcon={<FiShoppingBag />}>
                Start Shopping
              </Button>
              <Button as={Link} to="/seller/register" size={'lg'} fontWeight={'600'} px={8} variant={'outline'} colorScheme={'brand'} leftIcon={<FiTrendingUp />}>
                Start Selling
              </Button>
            </Stack>
          </MotionBox>

          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <HStack spacing={8} pt={4}>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">50K+</Text>
                <Text fontSize="sm" color="gray.500">Active Users</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">10K+</Text>
                <Text fontSize="sm" color="gray.500">Products</Text>
              </VStack>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">99.9%</Text>
                <Text fontSize="sm" color="gray.500">Uptime</Text>
              </VStack>
            </HStack>
          </MotionBox>
        </Stack>

        <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
          <MotionBox initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              w={'100%'}
              h={'100%'}
              borderRadius={'2xl'}
              boxShadow={'2xl'}
              src={'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
            />
          </MotionBox>
        </Flex>
      </Stack>
    </Container>
  );
};

export default HeroSection;
