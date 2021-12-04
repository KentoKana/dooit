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
  const projectData = useUserProjects(userStore?.user?.id ?? "");

  return (
    <PageWrapper
      pageHeading="My Portfolio"
      headingIcon={<AiOutlineFolderOpen />}
    >
      {projectData && (
        <Flex>
          <Box width="65%">
            <ProjectList
              projects={projectData.data?.projects ?? []}
              userData={projectData.data?.user!}
            />
          </Box>
          <Box width="35%" p={5} background="grey.50" height="100%">
            <Heading as="h3" fontSize="lg">
              {projectData.data?.user?.displayName}
            </Heading>
            {projectData?.data?.user?.bio && (
              <Text>{projectData.data?.user.bio}</Text>
            )}
            <Box>
              <Text as="div" fontWeight="bold" opacity={0.7}>
                Joined
              </Text>
              {dayjs(projectData.data?.user?.dateJoined).format("MMMM D, YYYY")}
            </Box>
          </Box>
        </Flex>
      )}
    </PageWrapper>
  );
});
