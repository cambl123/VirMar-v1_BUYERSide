import React from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Link,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue('gray.200', 'gray.700')}
      rounded="full"
      w={10}
      h={10}
      cursor="pointer"
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.3s ease"
      _hover={{ bg: useColorModeValue('teal.400', 'teal.600'), color: 'white' }}
      aria-label={label}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const Footer = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('teal.600', 'teal.300');

  return (
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={20}
      pt={10}
      pb={6}
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.300', 'gray.700')}
    >
      <Container as={Stack} maxW="6xl" spacing={8}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={4}>
            <Text fontWeight="bold" fontSize="xl" color="teal.600">
              VirMar
            </Text>
            <Text fontSize="sm" maxW="300px" color={linkColor}>
              Empowering Rwandan markets with digital innovation — buy, sell, and grow with confidence.
            </Text>
            <HStack spacing={4} mt={4}>
              <SocialButton label="Facebook" href="https://facebook.com/isaacchris">
                <FaFacebook />
              </SocialButton>
              <SocialButton label="Twitter" href="https://twitter.com/yourhandle">
                <FaTwitter />
              </SocialButton>
              <SocialButton label="Instagram" href="https://www.instagram.com/camble_coding/">
                <FaInstagram />
              </SocialButton>
              <SocialButton label="LinkedIn" href="https://linkedin.com/company/yourcompany">
                <FaLinkedin />
              </SocialButton>
            </HStack>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2} color="teal.600">
              Quick Links
            </Text>
            <Link href="/" color={linkColor} _hover={{ color: linkHoverColor }}>
              Home
            </Link>
            <Link href="/blog" color={linkColor} _hover={{ color: linkHoverColor }}>
              Blog
            </Link>
            <Link href="/about" color={linkColor} _hover={{ color: linkHoverColor }}>
              About Us
            </Link>
            <Link href="/contact" color={linkColor} _hover={{ color: linkHoverColor }}>
              Contact
            </Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2} color="teal.600">
              Support
            </Text>
            <Link href="/faq" color={linkColor} _hover={{ color: linkHoverColor }}>
              FAQ
            </Link>
            <Link href="/help" color={linkColor} _hover={{ color: linkHoverColor }}>
              Help Center
            </Link>
            <Link href="/privacy" color={linkColor} _hover={{ color: linkHoverColor }}>
              Privacy Policy
            </Link>
            <Link href="/terms" color={linkColor} _hover={{ color: linkHoverColor }}>
              Terms of Service
            </Link>
          </Stack>

          <Stack align="flex-start">
            <Text fontWeight="bold" fontSize="lg" mb={2} color="teal.600">
              Contact
            </Text>
            <Text color={linkColor}>Email: hscamble@gmail.com</Text>
            <Text color={linkColor}>Phone: +250 793 680614</Text>
            <Text color={linkColor}>huye, Rwanda</Text>
          </Stack>
        </SimpleGrid>

        <Text fontSize="sm" textAlign="center" pt={6} color={linkColor}>
          © {new Date().getFullYear()} VirMar. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
