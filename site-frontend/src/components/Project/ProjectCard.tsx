import { Box, Flex, Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import dayjs from "dayjs";

interface IProjectListProps {
  project: ProjectGetDto;
}
export const ProjectCard = observer(({ project }: IProjectListProps) => {
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
          <Heading as="h3" size="normal" fontWeight="medium">
            {project.name}
          </Heading>
          <Box mt={1} fontSize="smaller" opacity={0.7}>
            {dayjs(project.dateCreated).format("MMMM DD YYYY")}
          </Box>
          <Text mt={5} fontSize="small" fontWeight="light">
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
