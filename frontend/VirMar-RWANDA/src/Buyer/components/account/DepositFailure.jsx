// src/buyer/components/DepositFailure.jsx
import React from 'react';
import { Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const DepositFailure = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Icon as={WarningIcon} w={20} h={20} color="red.400" />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Deposit Failed
      </Heading>
      <Text color={'gray.500'}>
        There was an issue processing your deposit. Please try again or contact support.
      </Text>
      <Button mt={6} colorScheme="red" onClick={() => navigate('/buyer/wallet')}>
        Back to Wallet
      </Button>
    </Box>
  );
};

export default DepositFailure;
