import { Box, Flex, Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import { FlairTag } from "../FlairTag";
import { ProjectFlairsDto } from "../../Dtos/ProjectFlairsDto.dto";
import { useGetProjectCreationOptions } from "../../hooks/useGetProjectCreationOptions";
import { useState } from "react";

interface IProjectListProps {
  project: ProjectGetDto;
}
export const ProjectCard = observer(({ project }: IProjectListProps) => {
  const projectOptions = useGetProjectCreationOptions();
  const projectFlair = projectOptions.data?.flairs?.find(
    (flair) => flair.id === project.flairId
  );
  return (
    <Link
      display="block"
      key={project.id}
      as={RouterLink}
      to="#"
      _hover={{
        textDecoration: "none",
        color: "primary",
      }}
    >
      <Flex>
        <Box
          width="40%"
          p={5}
          background="grey.700"
          color="#fff"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
        >
          <Box mt={1} fontSize="smaller" opacity={0.7}>
            {dayjs(project.dateCreated).format("MMMM DD YYYY")}
          </Box>
          <Heading as="h3" size="md" fontWeight="medium">
            {project.name}
          </Heading>
          {projectFlair && (
            <Box mt={3}>
              <FlairTag flair={projectFlair} size="sm" />
            </Box>
          )}
          <Text mt={3} fontSize="medium" fontWeight="light">
            {project.description}
          </Text>
        </Box>
        <Box
          width="60%"
          p={5}
          background="grey.50"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
        >
          <Flex>
            {project.projectItems.map((item) => {
              return (
                <Image
                  borderRadius="10px"
                  key={item.id}
                  boxSize="33.33%"
                  objectFit="cover"
                  px="5px"
                  pb="5px"
                  src={item.imageUrl}
                  alt={item.description ?? ""}
                />
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Link>
  );
});
