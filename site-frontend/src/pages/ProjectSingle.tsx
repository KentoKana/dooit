import { Container } from "@chakra-ui/react";
import { BasePage } from "../components/Layouts/BasePage";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { ProjectSingle } from "../components/Project/ProjectSingle";
import { IPageProps } from "../utils/SharedInterfaces";

export const ProjectSinglePage = ({ showSidebar }: IPageProps) => {
  return (
    <BasePage showSidebar={showSidebar}>
      <ProjectSingle />
    </BasePage>
  );
};
