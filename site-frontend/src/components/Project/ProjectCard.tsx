import { Box, Flex, Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { FlairTag } from "../FlairTag";
import { truncateText } from "../../utils";
import { ProjectGetDto } from "../../Dtos/project/ProjectGetDto.dto";
import { UserGetWithProfileDto } from "../../Dtos/project/UserGetWithProfileDto.dto";
import { useGetProjectCreationOptions } from "../../hooks/data/useGetProjectCreationOptions";

interface IProjectListProps {
  project: ProjectGetDto;
  userData: UserGetWithProfileDto;
}
export const ProjectCard = observer(
  ({ project, userData }: IProjectListProps) => {
    const projectOptions = useGetProjectCreationOptions();
    const projectFlair = projectOptions.data?.flairs?.find(
      (flair) => flair.id === project.flairId
    );
    const projectItemImage = project.projectItems.find((item) => item.imageUrl);
    return (
      <Link
        display="block"
        key={project.id}
        as={RouterLink}
        to={`/${userData.displayName}/${project.id}`}
        _hover={{
          textDecoration: "none",
          color: "primary",
        }}
      >
        <Flex maxHeight="280px">
          <Box
            width={projectItemImage?.imageUrl ? "50%" : "100%"}
            p={5}
            background="grey.700"
            color="#fff"
            borderTopLeftRadius="md"
            borderBottomLeftRadius="md"
            borderRadius={projectItemImage ? undefined : "md"}
          >
            <Box fontSize="sm">{`${userData.displayName}`}</Box>
            <Box fontSize="xs" opacity={0.7} mb={2}>
              {dayjs(project.dateCreated).format("MMMM DD YYYY")}
            </Box>
            <Heading
              as="h3"
              fontSize={projectItemImage ? "lg" : undefined}
              fontWeight="medium"
              lineHeight="1.3"
            >
              {project.name}
            </Heading>
            {projectFlair && (
              <Box mt={3}>
                <FlairTag flair={projectFlair} size="sm" />
              </Box>
            )}
            <Text mt={3} fontSize="medium" fontWeight="light">
              {truncateText(project.description, 100)}
            </Text>
          </Box>
          {projectItemImage?.imageUrl && (
            <Box
              width="50%"
              background="grey.50"
              borderTopRightRadius="md"
              borderBottomRightRadius="md"
              overflow="hidden"
            >
              <Image
                src={projectItemImage.imageUrl}
                objectPosition="center"
                w="100%"
                h="100%"
                transition="0.8s ease all"
                _hover={{
                  transform: "scale(1.1)",
                }}
                borderTopRightRadius="md"
                borderBottomRightRadius="md"
                objectFit="cover"
              />
            </Box>
          )}
        </Flex>
      </Link>
    );
  }
);
