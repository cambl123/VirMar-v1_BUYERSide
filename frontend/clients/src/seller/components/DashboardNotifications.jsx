import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { Bell } from 'lucide-react';
import axios from 'axios';

const DashboardNotifications = () => {
  const bg = useColorModeValue('white', 'gray.900');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace this URL with your real backend notifications endpoint
        const res = await axios.get('http://localhost:5000/api/seller/notifications', { withCredentials: true });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Center h="150px">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.100" color="red.700" borderRadius="md">
        Error: {error}
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box p={5} bg={bg} borderRadius="md" shadow="sm" borderWidth="1px" w="100%">
        <HStack mb={4} spacing={3} alignItems="center">
          <Icon as={Bell} boxSize={6} />
          <Text fontSize="lg" fontWeight="bold">
            Notifications
          </Text>
        </HStack>
        <Divider mb={4} />
        <Text>No notifications yet.</Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      p={5}
      rounded="md"
      shadow="sm"
      borderWidth="1px"
      w="100%"
    >
      <HStack mb={4} spacing={3} alignItems="center">
        <Icon as={Bell} boxSize={6} />
        <Text fontSize="lg" fontWeight="bold">
          Notifications
        </Text>
      </HStack>
      <Divider mb={4} />
      <VStack spacing={4} align="stretch">
        {notifications.map((note) => (
          <Box
            key={note.id}
            p={3}
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderRadius="md"
          >
            <Text fontWeight="medium">{note.message}</Text>
            <Text fontSize="sm" color="gray.500">
              {note.time}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default DashboardNotifications;
