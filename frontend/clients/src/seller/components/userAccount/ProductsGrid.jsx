import React, { useEffect, useState } from "react";
import { SimpleGrid, Image, Box, Text, Spinner, Center } from "@chakra-ui/react";
import { useSeller } from "../context/SellerContext"; // adjust path

const ProductsGrid = () => {
  const { fetchStoreItems, seller } = useSeller();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!seller?.storeId) {
      setError("Seller store not found.");
      setLoading(false);
      return;
    }
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await fetchStoreItems(seller.storeId);
        setProducts(items);
      } catch (err) {
        setError(err.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchStoreItems, seller]);

  if (loading) return <Center><Spinner size="xl" /></Center>;
  if (error) return <Center color="red.500">{error}</Center>;

  if (!products.length)
    return <Center>No products found. Please add some.</Center>;

  return (
    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
      {products.map((product) => (
        <Box
          key={product._id}
          borderRadius="md"
          overflow="hidden"
          cursor="pointer"
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          <Image
            src={product.imageUrl || "https://via.placeholder.com/200"}
            alt={product.name}
            objectFit="cover"
            width="100%"
            height="200px"
          />
          <Box p={2}>
            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
              {product.name}
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default ProductsGrid;
