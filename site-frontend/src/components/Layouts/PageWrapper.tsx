import { Box, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

interface IPageWrapperProps {
  headingIcon?: ReactNode;
  pageHeading?: string;
  children?: ReactNode;
}
export const PageWrapper = observer(
  ({ children, pageHeading, headingIcon }: IPageWrapperProps) => {
    return (
      <Box as="main">
        {pageHeading && (
          <Heading
            as="h1"
            fontSize="18px"
            color="grey.700"
            display="flex"
            alignItems="center"
          >
            <Text>{headingIcon}</Text>{" "}
            <Text as="span" ml={2}>
              {pageHeading}
            </Text>
          </Heading>
        )}
        <Box my={5}>{children}</Box>
      </Box>
    );
  }
);
