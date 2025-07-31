import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Table, Tbody, Tr, Td, Text } from '@chakra-ui/react';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  // Add a check to prevent accessing properties of null or undefined
  if (!order) {
    return null; // If no order is selected, return null and do not render the modal
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Order Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg" mb={4}>Order ID: {order.orderId}</Text>
          <Text fontSize="lg" mb={4}>Order Date: {order.date}</Text>
          <Text fontSize="lg" mb={4}>Status: {order.status}</Text>
          
          <Table variant="simple">
            <Tbody>
              {order.items.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.product}</Td>
                  <Td>{item.price}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          
          <Text fontSize="lg" mt={4}>Total: {order.total}</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;
