import { Box, Skeleton, SkeletonText } from "@chakra-ui/react";

export const ProjectSingleSkeleton = () => {
  return (
    <>
      <Box width="30%" p={5} pt={0} mt={7}>
        <Skeleton height="100px" />
        <SkeletonText mt="4" noOfLines={5} spacing="4" />
      </Box>
      <Box width="70%" p={5} pt={0} display="flex" justifyContent="center">
        <Box mt={7} maxW="600px" w="100%">
          <Skeleton height="400px" />
          <SkeletonText mt="4" noOfLines={5} spacing="4" />
        </Box>
      </Box>
    </>
  );
};
