import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import LandingNavbar from './landingpage/Navbar';
import Footer from './landingpage/Footer';
import HeroSection from './landingpage/HeroSection';
import ProductSearchBar from './landingpage/ProductSearchBar';
import HowItWorks from './landingpage/HowItWorks';
import StatsSection from './landingpage/StatsSection';
import FeaturesSection from './landingpage/FeaturesSection';
import TestimonialsSection from './landingpage/TestimonialsSection';
import CallToAction from './landingpage/CallToAction';

const LandingPage = () => {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <Box className="landing-page" bg={bg}>
      <Navbar />
      <HeroSection />
      <ProductSearchBar />
      <HowItWorks />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </Box>
  );
};

export default LandingPage;
