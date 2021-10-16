import { Box, Flex } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";

interface IProjectListProps {
  projects: ProjectGetDto[];
}
export const ProjectList = observer(({ projects }: IProjectListProps) => {
  return (
    <>
      <Box as="section">
        <Flex>
          {projects.map((project) => {
            return (
              <Box key={project.id}>
                <Box>{project.name}</Box>
                {project.projectItems.map((item) => {
                  return (
                    <Box key={item.id}>
                      <Box>
                        <img src={item.imageUrl} alt={item.imageAlt} />
                      </Box>
                      <Box>{item.heading}</Box>
                      <Box>{item.description}</Box>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Flex>
      </Box>
    </>
  );
});
