import React from 'react';
import { HStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

const RatingStars = ({ rating = 0, maxStars = 5 }) => {
  return (
    <HStack spacing={1}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <StarIcon key={i} color={i < rating ? 'yellow.400' : 'gray.300'} />
      ))}
    </HStack>
  );
};

export default RatingStars;
