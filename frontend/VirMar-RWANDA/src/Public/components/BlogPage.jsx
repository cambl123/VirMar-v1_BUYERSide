import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Link,
  Image,
  useColorModeValue,
  Fade,
  Divider,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

// ✅ Navbar and Footer are imported from Marketplace folder
import Navbar from './Marketplace/Navbar';
import Footer from './Marketplace/Footer';

import './css/blog.css'; // Blog-specific styling

// 📝 Mock blog post data – Replace with actual API fetch later
const mockPosts = [
  {
    id: 1,
    title: 'The Future of E-commerce in Rwanda',
    excerpt:
      'Explore how VirMar is shaping the next generation of marketplaces across Kigali, Rubavu, Huye, and beyond.',
    author: 'Camble Isaac',
    date: '2025-07-21',
    tags: ['E-commerce', 'Rwanda', 'Innovation'],
    imageUrl:
      'https://images.unsplash.com/photo-1611784729110-2b3e1c2f2fd1?auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 2,
    title: 'How VirMar Handles Price Elasticity in Real Time',
    excerpt:
      'From demand scores to inflation tracking — see how our platform empowers sellers with smart data.',
    author: 'VirMar Dev Team',
    date: '2025-07-19',
    tags: ['Price', 'Data', 'Seller Insights'],
    imageUrl:
      'https://images.unsplash.com/photo-1591696331115-44cbf2bff7f1?auto=format&fit=crop&w=1350&q=80',
  },
];

const BlogPage = () => {
  // Dynamic background based on color mode (light/dark)
  const bg = useColorModeValue('#f7f9fb', '#0f1115');

  return (
    <Box bg={bg} minH="100vh">
      <Navbar />

      <Container maxW="7xl" py={16}>
        <Heading
          as="h1"
          fontSize={['3xl', '4xl', '5xl']}
          textAlign="center"
          mb={12}
          fontWeight="extrabold"
        >
          VirMar Blog & Economic Stories 📊
        </Heading>

        {/* Blog Post Cards Section */}
        <VStack spacing={14} align="stretch">
          {mockPosts.map((post, index) => (
            <Fade in key={post.id} delay={index * 0.2}>
              <Box
                className="blog-card"
                p={6}
                borderRadius="2xl"
                boxShadow="lg"
                bg={useColorModeValue('white', 'gray.800')}
                _hover={{
                  transform: 'scale(1.01)',
                  transition: '0.3s ease-in-out',
                }}
              >
                <HStack spacing={6} align="flex-start" flexDir={['column', 'row']}>
                  {/* Blog Image */}
                  <Box flexShrink={0} w={['100%', '45%']}>
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      borderRadius="2xl"
                      className="blog-image"
                    />
                  </Box>

                  {/* Blog Text Content */}
                  <VStack align="start" spacing={3} w="100%">
                    <Link
                      href={`/blog/${post.id}`}
                      fontSize="2xl"
                      fontWeight="bold"
                      className="blog-title"
                    >
                      {post.title}
                    </Link>
                    <Text fontSize="md" color="gray.600">
                      {post.excerpt}
                    </Text>

                    {/* Tags */}
                    <HStack spacing={2} pt={1}>
                      {post.tags.map((tag) => (
                        <Tag key={tag} colorScheme="purple" variant="solid">
                          {tag}
                        </Tag>
                      ))}
                    </HStack>

                    {/* Author + Date */}
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      ✍️ {post.author} &nbsp;&nbsp; • &nbsp;&nbsp; 🗓️ {post.date}
                    </Text>

                    {/* Read More Link */}
                    <Link
                      href={`/blog/${post.id}`}
                      fontSize="sm"
                      color="teal.500"
                      fontWeight="medium"
                      mt={2}
                    >
                      Read more <ArrowForwardIcon mx="2px" />
                    </Link>
                  </VStack>
                </HStack>
              </Box>
            </Fade>
          ))}
        </VStack>
      </Container>

      <Divider mt={20} />
      <Footer />
    </Box>
  );
};

export default BlogPage;
