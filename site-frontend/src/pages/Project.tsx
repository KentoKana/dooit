import { useParams } from "react-router";
import { useGetProjectById } from "../hooks/data/useGetProjectById";
import { Box, Heading, Text } from "@chakra-ui/react";

export const Project = () => {
  const { projectId } = useParams<{ username: string; projectId: string }>();

  const project = useGetProjectById(parseInt(projectId));
  const { data } = project;
  return (
    <Box>
      <Heading my={7}>{data?.name}</Heading>
      <Text>{data?.description}</Text>
    </Box>
  );
};
