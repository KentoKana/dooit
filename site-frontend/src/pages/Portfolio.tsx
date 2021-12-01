import { observer } from "mobx-react-lite";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useUserProjects } from "../hooks/useUserProjects";
import { ProjectList } from "../components/Project/ProjectList";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { UseStores } from "../stores/StoreContexts";
import dayjs from "dayjs";
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
        <Box width="30%" p={5} background="grey.50" height="100%">
          <Heading as="h3" fontSize="lg">
            {projects.data?.user?.firstName} {projects.data?.user?.lastName}
          </Heading>
          {projects?.data?.user?.bio && <Text>{projects.data?.user.bio}</Text>}
          <Box>
            <Text as="div" fontWeight="bold" opacity={0.7}>
              Joined
            </Text>
            {dayjs(projects.data?.user?.dateJoined).format("MMMM D, YYYY")}
          </Box>
        </Box>
      </Flex>
    </PageWrapper>
  );
});
