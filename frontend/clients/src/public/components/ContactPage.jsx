// src/pages/ContactPage.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: 'Message sent!',
      description: "We'll get back to you soon.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    e.target.reset(); // reset the form
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar />
      <Container maxW="7xl" py={{ base: '8', md: '16' }}>
        <VStack spacing={10} align="start">
          <Heading size="2xl" color="brand.700">
            Contact Us
          </Heading>
          <Text fontSize="lg" color="gray.600">
            We'd love to hear from you. Whether you're a buyer, seller, or just curious about VirMar, reach out!
          </Text>

          <HStack spacing={10} flexWrap="wrap" w="100%" align="start">
            {/* Contact Details */}
            <VStack align="start" spacing={4} flex="1">
              <HStack>
                <Icon as={FaPhone} color="brand.500" />
                <Text>+250 793 680 614</Text>
              </HStack>
              <HStack>
                <Icon as={FaEnvelope} color="brand.500" />
                <Text>hscamble@gmail.com</Text>
              </HStack>
              <HStack>
                <Icon as={FaMapMarkerAlt} color="brand.500" />
                <Text>Kigali, Rwanda</Text>
              </HStack>
            </VStack>

            {/* Contact Form */}
            <Box bg="white" p={6} rounded="md" shadow="md" flex="1" w="100%" maxW="500px">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" placeholder="Your name" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="you@example.com" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea placeholder="How can we help?" rows={5} />
                  </FormControl>

                  <Button type="submit" colorScheme="brand" width="full">
                    Send Message
                  </Button>
                </VStack>
              </form>
            </Box>
          </HStack>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactPage;
