import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Avatar,
  Button,
  useToast,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  ModalFooter,
} from '@chakra-ui/react';
import axios from 'axios';

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/buyer/profile', {
          withCredentials: true,
        });
        setBuyer(res.data);
      } catch (err) {
        toast({
          title: 'Failed to fetch profile',
          description: err.response?.data?.message || 'Server error',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleLocationUpdate = async () => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/buyer/profile/location',
        { location: newLocation },
        { withCredentials: true }
      );
      setBuyer((prev) => ({ ...prev, location: res.data.location }));
      toast({
        title: 'Location updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: 'Failed to update location',
        description: err.response?.data?.message || 'Try again later',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner size="xl" mx="auto" mt={20} display="block" />;

  if (!buyer)
    return (
      <Box mt={10} textAlign="center">
        <Text color="gray.500">Profile data not available</Text>
      </Box>
    );

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6}>
      <Heading mb={4}>My Profile</Heading>
      <Stack spacing={4}>
        <Avatar name={buyer.name} size="xl" />
        <Box>
          <Text fontWeight="bold">Name:</Text>
          <Text>{buyer.name}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Email:</Text>
          <Text>{buyer.email}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Location:</Text>
          <Text>{buyer.location || 'Not set'}</Text>
        </Box>
        <Button onClick={onOpen} colorScheme="blue" w="fit-content">
          Update Location
        </Button>
      </Stack>

      {/* Modal for Location Input */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter new location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleLocationUpdate}>
              Save
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BuyerProfile;
