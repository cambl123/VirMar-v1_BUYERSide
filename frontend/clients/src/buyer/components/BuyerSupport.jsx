import React, { useState } from 'react';
import {
  Box, Heading, Input, Textarea, Button, VStack, Text
} from '@chakra-ui/react';

const BuyerSupport = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Send to backend (e.g., POST /api/support)
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading size="lg" mb={4}>Buyer Support</Heading>
      {submitted ? (
        <Text color="green.500">Your message has been sent. We’ll get back to you soon!</Text>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input placeholder="Your Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input type="email" placeholder="Your Email" name="email" value={formData.email} onChange={handleChange} required />
            <Input placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
            <Textarea placeholder="Message" name="message" value={formData.message} onChange={handleChange} required />
            <Button type="submit" colorScheme="blue" width="full">Send Message</Button>
          </VStack>
        </form>
      )}
    </Box>
  );
};

export default BuyerSupport;
// C:\Users\HIRWA\Desktop\learning-react\react-course\src\buyer\components\BuyerSupport.jsx
