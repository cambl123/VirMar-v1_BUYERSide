import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Button,
  useToast,
  Badge,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { Edit } from "lucide-react";

import { useSeller } from "../../context/SellerContext"; // adjust path
import EditProfileForm from "./EditProfileForm";

const SellerProfile = () => {
  const { seller, fetchProfile, updateProfile } = useSeller();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [localSeller, setLocalSeller] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchProfile();
      } catch {
        toast({
          title: "Failed to load profile",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    loadProfile();
  }, [fetchProfile, toast]);

  // Keep local copy for editing
  useEffect(() => {
    if (seller) {
      setLocalSeller(seller);
    }
  }, [seller]);

  const handleSave = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Could not update profile.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (!localSeller) return null; // or loading spinner

  return (
    <Box maxW="900px" mx="auto" mt={10} px={6} py={8} bg="white" borderRadius="lg" boxShadow="lg">
      {!isEditing ? (
        <>
          <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
            <Flex align="center" gap={4}>
              <Avatar size="xl" src={localSeller.profilePic} name={localSeller.name} />
              <Box>
                <Heading size="lg">{localSeller.name}</Heading>
                <Text color="gray.500">@{localSeller.username}</Text>
                {localSeller.verified && <Badge colorScheme="green">Verified</Badge>}
              </Box>
            </Flex>

            <Button
              mt={{ base: 6, md: 0 }}
              colorScheme="blue"
              leftIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </Flex>

          <Divider my={6} />

          <Stack spacing={3}>
            <Text>
              <strong>Store:</strong> {localSeller.storeName}
            </Text>
            <Text>
              <strong>Email:</strong> {localSeller.email}
            </Text>
            <Text>
              <strong>Location:</strong> {localSeller.location}
            </Text>
            <Text>
              <strong>Rating:</strong> {localSeller.rating} ★
            </Text>
            <Text>
              <strong>Followers:</strong> {localSeller.followers?.toLocaleString()}
            </Text>
            <Text>
              <strong>Bio:</strong> {localSeller.bio}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Joined {localSeller.joined}
            </Text>
          </Stack>
        </>
      ) : (
        <EditProfileForm
          seller={localSeller}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default SellerProfile;
