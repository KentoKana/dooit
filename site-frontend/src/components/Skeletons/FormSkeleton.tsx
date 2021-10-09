import { Skeleton, Box } from "@chakra-ui/react";

export const FormSkeleton = () => {
  return (
    <Box>
      <Skeleton height="40px" mb={5} />
      <Skeleton height="40px" mb={5} />
      <Skeleton height="40px" mb={5} />
      <Skeleton height="100px" mb={5} />
    </Box>
  );
};
