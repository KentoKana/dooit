import { Box, Flex, Link } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";
import { Heading, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface IProjectListProps {
  project: ProjectGetDto;
}
export const ProjectCard = observer(({ project }: IProjectListProps) => {
  return (
    <Flex mb={5}>
      <Box
        width="30%"
        p={5}
        background="grey.700"
        color="#fff"
        borderTopLeftRadius="md"
        borderBottomLeftRadius="md"
      >
        <Heading as="h3" size="md" fontWeight="medium">
          {project.name}
        </Heading>
        <Text mt={5} fontSize="small">
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
        <Flex justifyContent="flex-end" alignItems="center">
          <Link
            as={RouterLink}
            to="#"
            _hover={{
              textDecoration: "none",
              color: "primary",
            }}
          >
            View <ArrowForwardIcon ml="1px" mb={1} />
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
});
