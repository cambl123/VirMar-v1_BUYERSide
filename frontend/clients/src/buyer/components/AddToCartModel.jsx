// src/buyer/components/AddToCartModal.jsx
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

function AddToCartModal({ product }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/buyer/cart',
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          withCredentials: true, // Ensure cookies/token are sent
        }
      );

      toast({
        title: 'Added to Cart',
        description: response.data.message || 'Item added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description:
          err.response?.data?.message || 'Something went wrong while adding to cart.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme="teal" mt={3} onClick={onOpen}>
        Add to Cart
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {product.name} to Cart</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NumberInput
              defaultValue={1}
              min={1}
              onChange={(valueString) => setQuantity(parseInt(valueString))}
            >
              <NumberInputField placeholder="Quantity" />
            </NumberInput>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddToCart}>
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddToCartModal;
