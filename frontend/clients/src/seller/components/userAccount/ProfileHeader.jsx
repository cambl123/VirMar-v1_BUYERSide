import React from "react";
import { Box, Flex, Avatar, Heading, Text, Button } from "@chakra-ui/react";

function ProfileHeader({ seller, onEditClick }) {
  return (
    <Flex align="center" gap={4} mb={4}>
      <Avatar
        size="xl"
        name={seller.name}
        src={seller.profilePic || seller.avatar}
      />
      <Box>
        <Heading size="lg">{seller.name}</Heading>
        <Text>{seller.email}</Text>
        <Text>{seller.phone}</Text>
        <Text>{seller.bio}</Text>
        <Button
          mt={2}
          colorScheme="blue"
          onClick={onEditClick}
          size="sm"
          fontWeight="semibold"
        >
          Edit Profile
        </Button>
      </Box>
    </Flex>
  );
}

export default ProfileHeader;
