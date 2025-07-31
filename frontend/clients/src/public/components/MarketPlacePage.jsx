// MarketplacePage.jsx
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
  Checkbox,
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
} from '@chakra-ui/react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const MarketplacePage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sellers, setSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const categories = ['Roots', 'Fruits', 'Legumes', 'Dairy'];
  const locations = ['Kigali', 'Rubavu', 'Huye'];

  const marketStats = [
    { label: 'Transactions', value: '1,042', helpText: '+12% this week' },
    { label: 'Avg Budget', value: '₣28,300', helpText: 'Based on buyer wallets' },
    { label: 'Total Products', value: allProducts.length.toString(), helpText: 'Dynamic count' },
    { label: 'Market Trust Index', value: '88%', helpText: 'Up from 83% last month' },
  ];

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:5000/api/public', { withCredentials: true })
      .then((res) => {
        const data = res.data;
        setSellers(data.sellers ?? []);

        const mappedProducts = (data.products ?? []).map((p) => {
          let priceAmount = 0;
          let priceLabel = '₣0';

          if (p.price) {
            if (typeof p.price === 'object') {
              priceAmount = p.price.amount ?? 0;
              priceLabel = `₣${priceAmount}`;
            } else if (typeof p.price === 'number') {
              priceAmount = p.price;
              priceLabel = `₣${priceAmount}`;
            } else if (typeof p.price === 'string') {
              const num = p.price.replace(/[^\d]/g, '');
              priceAmount = num ? parseInt(num, 10) : 0;
              priceLabel = p.price.startsWith('₣') ? p.price : `₣${priceAmount}`;
            }
          }

          return {
            _id: p._id,
            name: p.name,
            price: priceAmount,
            priceLabel,
            category: p.category || 'Uncategorized',
            location: p.location || 'Unknown',
            available: p.status === 'available',
            quantity: p.quantity ?? 0,
            img: p.img || '/products/default.png',
          };
        });

        setAllProducts(mappedProducts);
      })
      .catch((err) => {
        console.error('Failed to fetch marketplace data:', err);
        setError('Failed to load marketplace data.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (locationFilter) filtered = filtered.filter((p) => p.location === locationFilter);
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
  }, [allProducts, category, locationFilter, maxPrice, sortBy, searchTerm]);

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="8xl" py={10}>
        <Heading size="xl" mb={6} textAlign="center" color="brand.600">VirMar Marketplace</Heading>

        {/* ✅ Responsive Stats Section */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={10}>
          {marketStats.map((stat, i) => (
            <Stat key={i} p={5} bg="white" boxShadow="sm" borderRadius="lg" textAlign="center">
              <StatLabel>{stat.label}</StatLabel>
              <StatNumber fontSize="2xl">{stat.value}</StatNumber>
              <StatHelpText>{stat.helpText}</StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>

        {/* 🔜 Rest of content here (filters, tables/cards, modal, etc.) */}

      </Container>

      <Footer />
    </Box>
  );
};

export default MarketplacePage;
