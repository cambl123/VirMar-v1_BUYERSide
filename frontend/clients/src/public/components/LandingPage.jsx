import React, { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  SimpleGrid,
  Icon,
  HStack,
  VStack,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiStar,
  FiShoppingBag,
  FiCreditCard,
  FiGlobe,
  FiZap,
  FiAward,
  FiHeart,
  FiSearch,
  FiTruck,
  FiThumbsUp,
} from 'react-icons/fi';

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);

// Feature component (your original)
const Feature = ({ title, text, icon }) => (
  <Stack align={'center'} textAlign={'center'}>
    <Flex
      w={16}
      h={16}
      align={'center'}
      justify={'center'}
      color={'white'}
      rounded={'full'}
      bg={'brand.500'}
      mb={1}
    >
      {icon}
    </Flex>
    <Text fontWeight={600} fontSize={'lg'}>
      {title}
    </Text>
    <Text color={'gray.600'}>{text}</Text>
  </Stack>
);

// TestimonialCard (your original)
const TestimonialCard = ({ name, role, content, avatar, rating }) => (
  <Box boxShadow="md" borderRadius="md" p={5} bg={useColorModeValue('white', 'gray.700')}>
    <VStack spacing={4} align="start">
      <HStack>
        {Array(5)
          .fill('')
          .map((_, i) => (
            <Icon
              key={i}
              as={FiStar}
              color={i < rating ? 'yellow.400' : 'gray.300'}
              fill={i < rating ? 'yellow.400' : 'none'}
            />
          ))}
      </HStack>
      <Text color="gray.600" fontSize="md">
        "{content}"
      </Text>
      <HStack>
        <Image borderRadius="full" boxSize="40px" src={avatar} alt={name} />
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
            {name}
          </Text>
          <Text color="gray.500" fontSize="xs">
            {role}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  </Box>
);

// StatCard (your original)
const StatCard = ({ title, stat, icon, helpText, type }) => (
  <Box
    px={{ base: 4, md: 8 }}
    py={'5'}
    shadow={'xl'}
    border={'1px solid'}
    borderColor={useColorModeValue('gray.200', 'gray.500')}
    rounded={'lg'}
    bg={useColorModeValue('white', 'gray.800')}
  >
    <Flex justifyContent={'space-between'}>
      <Box pl={{ base: 2, md: 4 }}>
        <Text fontWeight={'medium'} isTruncated>
          {title}
        </Text>
        <Heading fontSize={'2xl'} fontWeight={'medium'}>
          {stat}
        </Heading>
        <Text>
          {type === 'increase' ? '▲' : '▼'} {helpText}
        </Text>
      </Box>
      <Box my={'auto'} color={useColorModeValue('gray.800', 'gray.200')} alignContent={'center'}>
        {icon}
      </Box>
    </Flex>
  </Box>
);

// HOW IT WORKS section component
const HowItWorks = () => {
  const bg = useColorModeValue('gray.50', 'gray.700');

  const steps = [
    {
      icon: FiSearch,
      title: 'Discover Products',
      description: 'Browse a wide variety of products from verified sellers.',
    },
    {
      icon: FiShield,
      title: 'Secure Escrow Payment',
      description: 'Your payment is safely held until you confirm delivery.',
    },
    {
      icon: FiTruck,
      title: 'Fast & Reliable Delivery',
      description: 'Track your orders and get deliveries on time.',
    },
    {
      icon: FiThumbsUp,
      title: 'Rate & Build Trust',
      description: 'Leave ratings to help build a trustworthy community.',
    },
  ];

  return (
    <Box bg={bg} py={16} px={4}>
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
              boxShadow="md"
              fontSize="3xl"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
            >
              <Icon as={icon} />
            </Box>
            <Text fontWeight="bold" fontSize="lg">
              {title}
            </Text>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>{description}</Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

// PRODUCT SEARCH BAR component
const ProductSearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const bg = useColorModeValue('white', 'gray.700');

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/buyer/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <Box maxW="7xl" mx="auto" bg={bg} p={6} rounded="lg" boxShadow="md" mb={12}>
      <HStack maxW="600px" mx="auto">
        <Input
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
          bg={useColorModeValue('gray.100', 'gray.600')}
          _focus={{ bg: useColorModeValue('white', 'gray.700') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button colorScheme="brand" size="lg" onClick={handleSearch} leftIcon={<FiSearch />}>
          Search
        </Button>
      </HStack>
    </Box>
  );
};

// MAIN LANDING PAGE component
const LandingPage = () => {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box className="landing-page" bg={bg}>
      <Navbar />

      {/* Hero Section */}
      <Container maxW={'7xl'} py={20}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading lineHeight={1.1} fontWeight={700} fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
                <Text as={'span'} position={'relative'}>
                  The Future of
                </Text>
                <br />
                <Text as={'span'} color={'brand.600'}>
                  Digital Commerce
                </Text>
              </Heading>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text color={'gray.500'} fontSize={'xl'} maxW={'3xl'}>
                Join Rwanda&apos;s most trusted marketplace where innovation meets security. Connect with verified sellers,
                discover unique products, and experience seamless transactions with our advanced escrow system.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
                <Button
                  as={Link}
                  to="/buyer/register"
                  size={'lg'}
                  fontWeight={'600'}
                  px={8}
                  colorScheme={'brand'}
                  leftIcon={<FiShoppingBag />}
                >
                  Start Shopping
                </Button>
                <Button
                  as={Link}
                  to="/seller/register"
                  size={'lg'}
                  fontWeight={'600'}
                  px={8}
                  variant={'outline'}
                  colorScheme={'brand'}
                  leftIcon={<FiTrendingUp />}
                >
                  Start Selling
                </Button>
              </Stack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <HStack spacing={8} pt={4}>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    50K+
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Active Users
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    10K+
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Products
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    99.9%
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Uptime
                  </Text>
                </VStack>
              </HStack>
            </MotionBox>
          </Stack>

          <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                borderRadius={'2xl'}
                boxShadow={'2xl'}
                src={
                  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                }
              />
            </MotionBox>
          </Flex>
        </Stack>
      </Container>

      {/* Add Product Search Bar */}
      <ProductSearchBar />

      {/* Add How It Works Section */}
      <HowItWorks />

      {/* Stats Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW={'7xl'}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
            <StatCard
              title={'Total Sales'}
              stat={'$2.5M'}
              icon={<FiTrendingUp size={'3em'} />}
              helpText={'23% from last month'}
              type={'increase'}
            />
            <StatCard
              title={'Active Sellers'}
              stat={'1,200'}
              icon={<FiUsers size={'3em'} />}
              helpText={'12% from last month'}
              type={'increase'}
            />
            <StatCard
              title={'Products Listed'}
              stat={'15,000'}
              icon={<FiShoppingBag size={'3em'} />}
              helpText={'8% from last month'}
              type={'increase'}
            />
            <StatCard
              title={'Customer Satisfaction'}
              stat={'4.9/5'}
              icon={<FiStar size={'3em'} />}
              helpText={'Based on 10k+ reviews'}
              type={'increase'}
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW={'7xl'} py={16}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Why Choose VirtuMarket?</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Experience the next generation of e-commerce with our cutting-edge features
          </Text>
        </Stack>

        <Container maxW={'7xl'} mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon={<Icon as={FiShield} w={10} h={10} />}
              title={'Secure Escrow'}
              text={'Advanced escrow system ensures safe transactions for both buyers and sellers'}
            />
            <Feature
              icon={<Icon as={FiZap} w={10} h={10} />}
              title={'Lightning Fast'}
              text={'Optimized performance with instant search and real-time updates'}
            />
            <Feature
              icon={<Icon as={FiAward} w={10} h={10} />}
              title={'Trust Score'}
              text={'AI-powered reputation system helps you make informed decisions'}
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title={'Global Reach'}
              text={'Connect with buyers and sellers from around the world'}
            />
          </SimpleGrid>
        </Container>
      </Container>

      {/* Testimonials Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
            <Heading fontSize={'3xl'}>What Our Users Say</Heading>
            <Text color={'gray.600'} fontSize={'xl'}>
              Join thousands of satisfied customers who trust VirtuMarket
            </Text>
          </Stack>

          <Container maxW={'7xl'} mt={10}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <TestimonialCard
                name="Sarah Johnson"
                role="Small Business Owner"
                content="VirtuMarket transformed my business. The escrow system gives me confidence in every transaction."
                avatar="https://bit.ly/sage-adebayo"
                rating={5}
              />
              <TestimonialCard
                name="Michael Chen"
                role="Tech Enthusiast"
                content="The user interface is incredibly intuitive. I found exactly what I was looking for in minutes."
                avatar="https://bit.ly/ryan-florence"
                rating={5}
              />
              <TestimonialCard
                name="Emma Davis"
                role="Fashion Designer"
                content="The trust score system helped me identify reliable suppliers. Highly recommended!"
                avatar="https://bit.ly/kent-c-dodds"
                rating={5}
              />
            </SimpleGrid>
          </Container>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxW={'7xl'} py={16}>
        <Stack
          bg={useColorModeValue('gray.50', 'gray.900')}
          py={16}
          px={8}
          spacing={8}
          align={'center'}
          direction={'column'}
          borderRadius={'2xl'}
        >
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Ready to Get Started?
          </Heading>
          <Text fontSize={'xl'} textAlign={'center'} color={'gray.600'}>
            Join VirtualMarket today and experience the future of digital commerce where economy meets Tech
          </Text>
          <Stack spacing={4} direction={{ base: 'column', md: 'row' }}>
            <Button
              as={Link}
              to="/buyer/register"
              size={'lg'}
              fontWeight={'600'}
              px={8}
              colorScheme={'brand'}
              leftIcon={<FiHeart />}
            >
              Join as Buyer
            </Button>
            <Button
              as={Link}
              to="/seller/register"
              size={'lg'}
              fontWeight={'600'}
              px={8}
              variant={'outline'}
              colorScheme={'brand'}
              leftIcon={<FiCreditCard />}
            >
              Join as Seller
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
