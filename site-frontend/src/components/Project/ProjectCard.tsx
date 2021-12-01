import { Box, Flex, Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import dayjs from "dayjs";
import { FlairTag } from "../FlairTag";
import { useGetProjectCreationOptions } from "../../hooks/useGetProjectCreationOptions";
import { truncateText } from "../../utils";
import { Fragment } from "react";

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
          <Heading as="h3" fontSize="lg" fontWeight="medium" lineHeight="1.3">
            {project.name}
          </Heading>
          {projectFlair && (
            <Box mt={3}>
              <FlairTag flair={projectFlair} size="sm" />
            </Box>
          )}
          <Text mt={3} fontSize="medium" fontWeight="light">
            {truncateText(project.description, 150)}
          </Text>
        </Box>
        <Box
          width="60%"
          //   p={5}
          background="grey.50"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
        >
          <Flex flexWrap="wrap" alignItems="center" h="100%">
            {project.projectItems.map((item, index) => {
              return index < 1 ? (
                <Image
                  src={item.imageUrl ?? ""}
                  objectPosition="center"
                  w="100%"
                  h="100%"
                  borderTopRightRadius="md"
                  borderBottomRightRadius="md"
                  key={item.id}
                  objectFit="cover"
                />
              ) : (
                <Fragment key={item.id}></Fragment>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Link>
  );
});
