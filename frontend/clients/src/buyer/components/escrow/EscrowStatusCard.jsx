import React from 'react';
import { Box, Text, Badge } from '@chakra-ui/react';

const EscrowStatusCard = ({ order }) => {
  const { _id, status, totalAmount, transactionStatus } = order;

  const escrowColor = {
    held: 'yellow',
    released: 'green',
    cancelled: 'red',
    completed: 'blue',
    pending: 'gray',
  };

  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="md">
      <Text fontSize="lg">Order ID: {_id}</Text>
      <Text>Total: ${totalAmount}</Text>
      <Text>Status: <Badge colorScheme="blue">{status}</Badge></Text>
      <Text>
        Escrow:
        <Badge colorScheme={escrowColor[transactionStatus]} ml={2}>
          {transactionStatus.toUpperCase()}
        </Badge>
      </Text>
    </Box>
  );
};

export default EscrowStatusCard;
