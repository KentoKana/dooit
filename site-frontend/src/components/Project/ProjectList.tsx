import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ProjectGetDto } from "../../Dtos/ProjectGetDto.dto";
import { UserGetWithProfileDto } from "../../Dtos/UserGetWithProfileDto.dto";
import { ProjectCard } from "./ProjectCard";

interface IProjectListProps {
  projects: ProjectGetDto[];
  userData: UserGetWithProfileDto;
}
export const ProjectList = observer(
  ({ projects, userData }: IProjectListProps) => {
    return (
      <Box>
        {projects.map((project) => {
          return (
            <Box mb={2} mr={5} key={project.id}>
              <ProjectCard project={project} userData={userData} />
            </Box>
          );
        })}
      </Box>
    );
  }
);
