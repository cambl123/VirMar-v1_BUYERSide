import React from 'react';
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Badge,
  Button,
  HStack,
  VStack,
  Icon,
  IconButton,
  Tooltip,
  Avatar,
  Card,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { FiStar, FiHeart, FiShoppingCart, FiEye, FiMapPin, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    imageUrl,
    seller,
    rating = 0,
    reviewCount = 0,
    category = 'Electronics',
    location = 'Kigali, Rwanda',
    isNew = false,
    discount = null,
    originalPrice = null,
  } = product;

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const priceColor = useColorModeValue('brand.600', 'brand.300');

  return (
    <MotionBox
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        bg={cardBg}
        boxShadow={'lg'}
        rounded={'xl'}
        overflow={'hidden'}
        position={'relative'}
        _hover={{
          boxShadow: '2xl',
        }}
        transition={'all 0.3s ease'}
      >
        {/* Image Section */}
        <Box position={'relative'} overflow={'hidden'}>
          <Image
            src={imageUrl || 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
            alt={name}
            h={'250px'}
            w={'full'}
            objectFit={'cover'}
            transition={'transform 0.3s ease'}
            _hover={{ transform: 'scale(1.05)' }}
          />
          
          {/* Badges */}
          <Box position={'absolute'} top={3} left={3}>
            <Stack spacing={2}>
              {isNew && (
                <Badge colorScheme={'green'} variant={'solid'} fontSize={'xs'}>
                  NEW
                </Badge>
              )}
              {discount && (
                <Badge colorScheme={'red'} variant={'solid'} fontSize={'xs'}>
                  -{discount}%
                </Badge>
              )}
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Box position={'absolute'} top={3} right={3}>
            <VStack spacing={2}>
              <Tooltip label="Add to Wishlist" placement="left">
                <IconButton
                  icon={<FiHeart />}
                  size={'sm'}
                  variant={'solid'}
                  bg={'white'}
                  color={'gray.600'}
                  _hover={{ bg: 'red.50', color: 'red.500' }}
                  borderRadius={'full'}
                  boxShadow={'md'}
                />
              </Tooltip>
              <Tooltip label="Quick View" placement="left">
                <IconButton
                  icon={<FiEye />}
                  size={'sm'}
                  variant={'solid'}
                  bg={'white'}
                  color={'gray.600'}
                  _hover={{ bg: 'brand.50', color: 'brand.500' }}
                  borderRadius={'full'}
                  boxShadow={'md'}
                />
              </Tooltip>
            </VStack>
          </Box>

          {/* Category Badge */}
          <Box position={'absolute'} bottom={3} left={3}>
            <Badge
              bg={'blackAlpha.700'}
              color={'white'}
              px={2}
              py={1}
              borderRadius={'md'}
              fontSize={'xs'}
            >
              {category}
            </Badge>
          </Box>
        </Box>

        <CardBody p={6}>
          <Stack spacing={3}>
            {/* Product Name */}
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'xl'}
              fontWeight={600}
              noOfLines={2}
              minH={'3rem'}
            >
              {name}
            </Heading>

            {/* Seller Info */}
            <HStack spacing={3}>
              <Avatar size={'xs'} src={'https://bit.ly/sage-adebayo'} />
              <VStack align={'start'} spacing={0}>
                <Text fontSize={'sm'} fontWeight={500} color={textColor}>
                  {seller}
                </Text>
                <HStack spacing={1}>
                  <Icon as={FiMapPin} w={3} h={3} color={'gray.400'} />
                  <Text fontSize={'xs'} color={'gray.400'}>
                    {location}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {/* Rating */}
            <HStack spacing={2}>
              <HStack spacing={1}>
                {Array(5).fill('').map((_, i) => (
                  <Icon
                    key={i}
                    as={FiStar}
                    w={4}
                    h={4}
                    color={i < Math.floor(rating) ? 'yellow.400' : 'gray.300'}
                    fill={i < Math.floor(rating) ? 'yellow.400' : 'none'}
                  />
                ))}
              </HStack>
              <Text fontSize={'sm'} color={textColor}>
                {rating.toFixed(1)} ({reviewCount} reviews)
              </Text>
            </HStack>

            {/* Price */}
            <HStack spacing={2} align={'baseline'}>
              <Text
                color={priceColor}
                fontSize={'2xl'}
                fontWeight={700}
              >
                RWF {price}
              </Text>
              {originalPrice && (
                <Text
                  color={'gray.400'}
                  fontSize={'lg'}
                  textDecoration={'line-through'}
                >
                  RWF {originalPrice}
                </Text>
              )}
            </HStack>

            {/* Time Posted */}
            <HStack spacing={1}>
              <Icon as={FiClock} w={3} h={3} color={'gray.400'} />
              <Text fontSize={'xs'} color={'gray.400'}>
                Posted 2 hours ago
              </Text>
            </HStack>
          </Stack>
        </CardBody>

        <CardFooter pt={0} px={6} pb={6}>
          <Stack spacing={3} w={'full'}>
            <Button
              as={Link}
              to={`/buyer/product/${id}`}
              colorScheme={'brand'}
              size={'md'}
              w={'full'}
              leftIcon={<FiEye />}
            >
              View Details
            </Button>
            <HStack spacing={2}>
              <Button
                flex={1}
                variant={'outline'}
                colorScheme={'brand'}
                size={'sm'}
                leftIcon={<FiShoppingCart />}
              >
                Add to Cart
              </Button>
              <Button
                flex={1}
                colorScheme={'green'}
                size={'sm'}
              >
                Buy Now
              </Button>
            </HStack>
          </Stack>
        </CardFooter>
      </Card>
    </MotionBox>
  );
};

export default ProductCard;
