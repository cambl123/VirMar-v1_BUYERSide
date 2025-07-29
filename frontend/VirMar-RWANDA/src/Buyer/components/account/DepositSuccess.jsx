// src/buyer/components/DepositSuccess.jsx
import React from 'react';
import { Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const DepositSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Icon as={CheckCircleIcon} w={20} h={20} color="green.400" />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Deposit Successful!
      </Heading>
      <Text color={'gray.500'}>
        Your funds have been added to your wallet. You can now start shopping!
      </Text>
      <Button mt={6} colorScheme="green" onClick={() => navigate('/buyer/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default DepositSuccess;
