import { observer } from "mobx-react-lite";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useUserProjects } from "../hooks/useUserProjects";
import { ProjectList } from "../components/Project/ProjectList";
export const Portfolio = observer(() => {
  const projects = useUserProjects();

  return (
    <PageWrapper
      pageHeading="My Portfolio"
      headingIcon={<AiOutlineFolderOpen />}
    >
      <ProjectList projects={projects.data ?? []} />
    </PageWrapper>
  );
});
