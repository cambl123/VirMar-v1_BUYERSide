import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  useBreakpointValue,
  useDisclosure,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import './css/market.css';  // Adjust path if needed


import Navbar from './landingpage/Navbar';
import Footer from './landingpage/Footer';

import MarketplaceStats from './Marketplace/MarketplaceStats';
import MarketplaceFilters from './Marketplace/MarketplaceFilters';
import ProductList from './Marketplace/ProductList';
import ProductDetailsModal from './Marketplace/ProductDetailsModal';

/**
 * Main marketplace page component - displays products, filters, stats, and modal
 */
const MarketplacePage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // State: data
  const [sellers, setSellers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // State: UI & filters
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    maxPrice: 3000,
    sortBy: '',
    searchTerm: '',
  });

  // Static options (could be fetched from backend later)
  const categories = ['Roots', 'Fruits', 'Legumes', 'Dairy'];
  const locations = ['Kigali', 'Rubavu', 'Huye'];

  /**
   * Fetch marketplace data from backend API on mount
   * - Expects { sellers: [], products: [] } in response
   */
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('http://localhost:5000/api/public', { withCredentials: true })
      .then((res) => {
        const data = res.data;

        setSellers(data.sellers ?? []);

        // Normalize products for frontend usage, especially price parsing
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

  /**
   * Filter and sort products based on filters state
   */
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter((p) => p.location === filters.location);
    }
    filtered = filtered.filter((p) => p.price <= filters.maxPrice);

    if (filters.searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.sortBy === 'priceAsc') {
      filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceDesc') {
      filtered = filtered.slice().sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'nameAsc') {
      filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [allProducts, filters]);

  /**
   * Handler for showing product details modal
   */
  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  /**
   * Handler for updating filter values
   */
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Market stats data shown in stats section
  const marketStats = [
    { label: 'Transactions', value: '1,042', helpText: '+12% this week' },
    { label: 'Avg Budget', value: '₣28,300', helpText: 'Based on buyer wallets' },
    { label: 'Total Products', value: allProducts.length.toString(), helpText: 'Dynamic count' },
    { label: 'Market Trust Index', value: '88%', helpText: 'Up from 83% last month' },
  ];

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />

      <Container maxW="8xl" py={10}>
        <Heading size="xl" mb={6} textAlign="center" color="brand.600">
          VirMar Marketplace
        </Heading>

        {/* Marketplace Stats */}
        <MarketplaceStats stats={marketStats} />

        {/* Show loading spinner or error if needed */}
        {loading && (
          <Center py={20}>
            <Spinner size="xl" color="brand.500" />
          </Center>
        )}

        {error && (
          <Center py={20}>
            <Text color="red.500" fontWeight="bold">
              {error}
            </Text>
          </Center>
        )}

        {/* Filters + Product List */}
        {!loading && !error && (
          <>
            <MarketplaceFilters
              categories={categories}
              locations={locations}
              filters={filters}
              onFilterChange={handleFilterChange}
              maxPrice={filters.maxPrice}
            />

            <ProductList products={filteredProducts} onShowDetails={handleShowDetails} />
          </>
        )}

        {/* Product Details Modal */}
        <ProductDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          product={selectedProduct}
        />
      </Container>

      <Footer />
    </Box>
  );
};

export default MarketplacePage;
