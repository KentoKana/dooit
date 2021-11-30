import { observer } from "mobx-react-lite";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useUserProjects } from "../hooks/useUserProjects";
import { ProjectList } from "../components/Project/ProjectList";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { UseStores } from "../stores/StoreContexts";
export const Portfolio = observer(() => {
  const { userStore } = UseStores();
  const projects = useUserProjects(userStore?.user?.id ?? "");

  return (
    <PageWrapper
      pageHeading="My Portfolio"
      headingIcon={<AiOutlineFolderOpen />}
    >
      <Flex>
        <Box width="70%">
          <ProjectList projects={projects.data?.projects ?? []} />
        </Box>
        <Box width="30%" p={3} background="grey.50">
          <Heading as="h3" fontSize="lg">
            {projects.data?.user?.firstName} {projects.data?.user?.lastName}
          </Heading>
        </Box>
      </Flex>
    </PageWrapper>
  );
});
