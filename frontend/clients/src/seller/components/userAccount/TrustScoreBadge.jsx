import React from "react";
import { Badge, Tooltip } from "@chakra-ui/react";
import { Star } from "lucide-react";

const TrustScoreBadge = ({ score }) => {
  const stars = Math.round(score * 2) / 2;
  const fullStars = Math.floor(stars);
  const halfStar = stars % 1 !== 0;

  return (
    <Tooltip label={`Trust score: ${score} / 5`} fontSize="sm">
      <Badge
        colorScheme="yellow"
        px={2}
        py={1}
        borderRadius="md"
        display="flex"
        alignItems="center"
        gap={1}
      >
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} fill="#FFD700" color="#FFD700" />
        ))}
        {halfStar && <Star key="half" size={14} fill="url(#half)" color="#FFD700" />}
      </Badge>
    </Tooltip>
  );
};

export default TrustScoreBadge;
