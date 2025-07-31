// src/buyer/components/dashboard/QuickActions.jsx
import React from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { MdAccountBalanceWallet, MdShoppingCart, MdSupportAgent } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <HStack spacing={4} mb={8}>
      <Button
        colorScheme="teal"
        leftIcon={<MdAccountBalanceWallet />}
        onClick={() => navigate('/buyer/wallet')}
      >
        Wallet
      </Button>
      <Button
        colorScheme="blue"
        leftIcon={<MdShoppingCart />}
        onClick={() => navigate('/buyer/search')}
      >
        Shop Products
      </Button>
      <Button
        colorScheme="purple"
        leftIcon={<MdSupportAgent />}
        onClick={() => navigate('/buyer/support')}
      >
        Support
      </Button>
    </HStack>
  );
};

export default QuickActions;
