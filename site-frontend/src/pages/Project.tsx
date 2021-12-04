import { useParams } from "react-router";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { useGetProjectById } from "../hooks/data/useGetProjectById";
import { Text } from "@chakra-ui/react";

export const Project = () => {
  const { projectId } = useParams<{ username: string; projectId: string }>();

  const project = useGetProjectById(parseInt(projectId));
  const { data } = project;
  return (
    <PageWrapper
      headingFontSize={["30px", "30px", "40px"]}
      pageHeading={data?.name}
    >
      <Text>{data?.description}</Text>
    </PageWrapper>
  );
};
