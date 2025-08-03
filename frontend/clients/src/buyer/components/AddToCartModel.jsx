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
  NumberInput,
  NumberInputField,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_BASE_URL } from '../../configs/api.config'; // Correct path to your config file
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext is in src/context

function AddToCartModal({ product }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth(); // Get the authenticated user from your AuthContext

  const handleAddToCart = async () => {
    if (!user || !user.cartId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add items to your cart.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setLoading(true);

    try {
      // Use the dynamic API_BASE_URL and the correct route from your backend files
      const response = await axios.post(
        `${API_BASE_URL}/api/buyer/cart/${user.cartId}/item`,
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );

      toast({
        title: 'Success!',
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="teal" mt={3} onClick={onOpen} disabled={loading}>
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
            <Button colorScheme="blue" mr={3} onClick={handleAddToCart} isLoading={loading}>
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