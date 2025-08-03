import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  Badge,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Select,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  useBreakpointValue,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { API_BASE_URL } from '../../configs/api.config'; // Adjust path as needed

const MarketplacePage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters and state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000000); // Set a reasonable max price default
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const [sellers, setSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [marketStats, setMarketStats] = useState([]);

  // Fetching data from the backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const [publicRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/public`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/api/public/stats`), // Assuming a public stats endpoint
        ]);

        const products = publicRes.data.products ?? [];
        setSellers(publicRes.data.sellers ?? []);

        // Dynamic stats from API and calculated values
        const stats = [
          { label: 'Total Products', value: products.length, helpText: 'Number of items available' },
          { label: 'Total Sellers', value: publicRes.data.sellers?.length ?? 0, helpText: 'Active sellers on the platform' },
          { label: 'Total Transactions', value: statsRes.data.totalTransactions ?? 0, helpText: '+12% this week' },
          { label: 'Avg Transaction Value', value: statsRes.data.avgTransactionValue ?? 0, helpText: 'Based on buyer spending' },
        ];
        setMarketStats(stats);

        setAllProducts(products);
      } catch (err) {
        console.error('Failed to fetch marketplace data:', err);
        setError('Failed to load marketplace data.');
        toast({
          title: 'Error',
          description: 'Failed to load marketplace data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (categoryFilter) filtered = filtered.filter((p) => p.category === categoryFilter);
    if (locationFilter) filtered = filtered.filter((p) => p.store?.location === locationFilter);
    filtered = filtered.filter((p) => p.price <= maxPrice);

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'priceAsc') filtered = filtered.slice().sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceDesc') filtered = filtered.slice().sort((a, b) => b.price - a.price);
    else if (sortBy === 'nameAsc') filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [allProducts, categoryFilter, locationFilter, maxPrice, sortBy, searchTerm]);


  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const getPriceLabel = (price) => {
    return `₣${(price ?? 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="8xl" py={10}>
        <Heading size="xl" mb={6} textAlign="center" color="brand.600">VirMar Marketplace</Heading>

        {/* Dynamic Stats Section */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={10}>
          {marketStats.map((stat, i) => (
            <Stat key={i} p={5} bg="white" boxShadow="sm" borderRadius="lg" textAlign="center">
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber fontSize="2xl">{stat.value.toLocaleString()}</StatNumber>
              <StatHelpText>{stat.helpText}</StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>

        {/* Filters and Search */}
        <VStack spacing={4} align="stretch" mb={8} p={5} bg="white" boxShadow="sm" borderRadius="lg">
          <Heading size="md">Filters</Heading>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <HStack spacing={4} wrap="wrap">
            <Select
              placeholder="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {['Roots', 'Fruits', 'Legumes', 'Dairy'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
            <Select
              placeholder="Filter by Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              {['Kigali', 'Rubavu', 'Huye'].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </Select>
            <Select
              placeholder="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nameAsc">Name (A-Z)</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
            </Select>
          </HStack>
          <Box>
            <Text mb={2}>Max Price: {getPriceLabel(maxPrice)}</Text>
            <Slider
              aria-label="max-price-slider"
              defaultValue={3000000}
              min={0}
              max={5000000}
              step={1000}
              onChange={(val) => setMaxPrice(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </VStack>

        {/* Product Listing */}
        <Box p={5} bg="white" boxShadow="sm" borderRadius="lg">
          <Heading size="md" mb={4}>Available Products ({filteredProducts.length})</Heading>
          {filteredProducts.length === 0 ? (
            <Text>No products match your search criteria.</Text>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
              {filteredProducts.map((product) => (
                <Box key={product._id} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} position="relative">
                  <Image src={product.img} alt={product.name} boxSize="150px" objectFit="cover" mx="auto" />
                  <VStack align="start" mt={4} spacing={1}>
                    <Heading size="sm">{product.name}</Heading>
                    <Text fontSize="lg" fontWeight="bold" color="green.500">{getPriceLabel(product.price)}</Text>
                    <HStack>
                      <Badge colorScheme="blue">{product.category}</Badge>
                      <Badge colorScheme="purple">{product.store?.location}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">In stock: {product.quantity}</Text>
                    <Button mt={2} size="sm" colorScheme="blue" onClick={() => handleShowDetails(product)}>
                      View Details
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Product Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedProduct?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedProduct && (
                <HStack align="start" spacing={8}>
                  <Image src={selectedProduct.img} alt={selectedProduct.name} boxSize="300px" objectFit="cover" />
                  <VStack align="start" spacing={4}>
                    <Text fontSize="2xl" fontWeight="bold" color="green.500">
                      {getPriceLabel(selectedProduct.price)}
                    </Text>
                    <HStack>
                      <Badge colorScheme="blue" fontSize="md">{selectedProduct.category}</Badge>
                      <Badge colorScheme="purple" fontSize="md">{selectedProduct.store?.location}</Badge>
                    </HStack>
                    <Text fontSize="md">
                      <strong>Quantity Available:</strong> {selectedProduct.quantity}
                    </Text>
                    <Text fontSize="md">
                      <strong>Description:</strong> {selectedProduct.description || 'No description available.'}
                    </Text>
                    <Button colorScheme="green" size="lg" w="100%" mt={4}>
                      Add to Cart
                    </Button>
                  </VStack>
                </HStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>

      <Footer />
    </Box>
  );
};

export default MarketplacePage;