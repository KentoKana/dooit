import { useParams } from "react-router";
import { useGetProjectById } from "../../../hooks/data/useGetProjectById";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { ProjectItems } from "./ProjectItems";
import { FlairTag } from "../../FlairTag";
import { useQueryClient } from "react-query";
import { ProjectCreateOptionsDto } from "../../../Dtos/project/ProjectCreateOptionsDto.dto";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export const ProjectSingle = () => {
  const { projectId } = useParams<{ username: string; projectId: string }>();
  const project = useGetProjectById(parseInt(projectId));
  const { data } = project;
  const client = useQueryClient();
  const options = client.getQueryData<ProjectCreateOptionsDto>(
    "projectCreateOptions"
  );
  const flairDto = options?.flairs.find((flair) => flair.id === data?.flairId);
  return (
    <Box>
      <Flex>
        <Box width="30%" p={5} pt={0}>
          <Heading my={7}>{data?.name}</Heading>
          <Box fontSize="md" fontWeight="bold" color="grey.700">
            <Link to={`/${data?.user.username}/`}>
              By {data?.user.username}
            </Link>
          </Box>
          <Box fontSize="md" opacity={0.7} mb={3}>
            Created {dayjs(data?.dateCreated).format("MMMM DD, YYYY")}
          </Box>
          {flairDto && (
            <Box mb={3}>
              <FlairTag flair={flairDto} />
            </Box>
          )}
          <Text>{data?.description}</Text>
        </Box>
        <Box width="70%" p={5} pt={0} display="flex" justifyContent="center">
          <ProjectItems data={data} />
        </Box>
      </Flex>
    </Box>
  );
};
