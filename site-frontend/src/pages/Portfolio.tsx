import { observer } from "mobx-react-lite";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { ProjectList } from "../components/Project/ProjectList";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useUserProjects } from "../hooks/data/useUserProjects";
import { useEffect, useState } from "react";
import { isNullOrUndefined } from "../utils";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { DrawerTemplate } from "../components/DrawerTemplate";
import { ProjectSingle } from "../components/Project/ProjectSingle";

export const Portfolio = observer(() => {
  const { projectId, username } =
    useParams<{ username: string; projectId?: string }>();
  const projectData = useUserProjects(username);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(
    !isNullOrUndefined(projectId)
  );

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (projectId) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [projectId, history, location]);

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
              {projectData.data?.user?.username}
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
      <DrawerTemplate
        isOpen={drawerOpen}
        placement="bottom"
        size="full"
        onClose={() => {}}
        orientation="vertical"
        closeOnEsc={false}
        drawerHeader={
          <Container maxWidth="1200px">
            <Flex justifyContent="start" w="100%">
              <Button
                variant="outline"
                onClick={() => {
                  history.push(`/${projectData.data?.user?.username}`);
                  setDrawerOpen(false);
                }}
              >
                Back to Portfolio
              </Button>
            </Flex>
          </Container>
        }
      >
        <Container maxWidth="1200px">
          <ProjectSingle />
        </Container>
      </DrawerTemplate>
    </PageWrapper>
  );
});
