import { useParams } from "react-router";
import { useGetProjectById } from "../../../hooks/data/useGetProjectById";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";

import { ProjectItems } from "./ProjectItems";
import { FlairTag } from "../../FlairTag";
import { useQueryClient } from "react-query";
import { ProjectCreateOptionsDto } from "../../../Dtos/project/ProjectCreateOptionsDto.dto";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { ProjectSingleSkeleton } from "../../Skeletons/ProjectSignleSkeleton";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { BreakPoints } from "../../../enums/BreakPoints";

export const ProjectSingle = () => {
  const history = useHistory();
  const { projectId } = useParams<{ username: string; projectId: string }>();
  const project = useGetProjectById(parseInt(projectId));
  const { data, isLoading } = project;
  const client = useQueryClient();
  const options = client.getQueryData<ProjectCreateOptionsDto>(
    "projectCreateOptions"
  );
  const [showMobileLayout] = useMediaQuery(BreakPoints.Mobile);

  const flairDto = options?.flairs.find((flair) => flair.id === data?.flairId);

  return (
    <Container maxW="1000px">
      <Flex w="100%" flexDirection={showMobileLayout ? "column" : "row"}>
        {isLoading ? (
          <ProjectSingleSkeleton />
        ) : (
          <>
            <Box
              width={showMobileLayout ? "100%" : "40%"}
              p={showMobileLayout ? 0 : 5}
              pt={0}
            >
              <Box>
                <Heading my={7}>{data?.name}</Heading>
                <Box fontSize="md" fontWeight="bold" color="grey.700">
                  <Link to={`/${data?.user.username}/`}>
                    By {data?.user.username}
                  </Link>
                </Box>
                <Box fontSize="md" opacity={0.7} mb={3}>
                  Created {dayjs(data?.dateCreated).format("MMMM DD, YYYY")}
                </Box>
                {flairDto && (
                  <Box mb={3}>
                    <FlairTag flair={flairDto} />
                  </Box>
                )}
                <Text>{data?.description}</Text>
              </Box>
              <Box my="3">
                <Button
                  variant="unstyled"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  <ArrowBackIcon /> Back
                </Button>
              </Box>
            </Box>
            <Box
              width={showMobileLayout ? "100%" : "60%"}
              p={showMobileLayout ? 0 : 5}
              pt={0}
              display="flex"
              justifyContent="center"
            >
              <ProjectItems data={data} />
            </Box>
          </>
        )}
      </Flex>
    </Container>
  );
};
