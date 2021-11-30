import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { ProjectCard } from "./ProjectCard";

interface IProjectListProps {
  projects: ProjectGetDto[];
}
export const ProjectList = observer(({ projects }: IProjectListProps) => {
  return (
    <Box>
      {projects.map((project) => {
        return (
          <Box mb={2} mr={5} key={project.id}>
            <ProjectCard project={project} />
          </Box>
        );
      })}
    </Box>
  );
});
