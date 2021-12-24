import { useParams } from "react-router";
import { useGetProjectById } from "../../../hooks/data/useGetProjectById";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { ProjectItems } from "./ProjectItems";

export const ProjectSingle = () => {
  const { projectId } = useParams<{ username: string; projectId: string }>();

  const project = useGetProjectById(parseInt(projectId));
  const { data } = project;
  return (
    <Box>
      <Flex>
        <Box width="30%" p={5} pt={0}>
          <Heading my={7}>{data?.name}</Heading>
          <Text>{data?.description}</Text>
        </Box>
        <Box width="70%" p={5} pt={0} display="flex" justifyContent="center">
          <ProjectItems data={data} />
        </Box>
      </Flex>
    </Box>
  );
};
