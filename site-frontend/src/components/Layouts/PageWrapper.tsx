import { Box, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

interface IPageWrapperProps {
  headingIcon?: ReactNode;
  pageHeading?: string;
  headingFontSize?: string | number | string[] | number[];
  children?: ReactNode;
}
export const PageWrapper = observer(
  ({
    children,
    pageHeading,
    headingIcon,
    headingFontSize = "18px",
  }: IPageWrapperProps) => {
    return (
      <Box as="main">
        {pageHeading && (
          <Heading
            as="h1"
            fontSize={headingFontSize}
            color="grey.700"
            display="flex"
            alignItems="center"
          >
            <Text>{headingIcon}</Text>{" "}
            <Text as="span" ml={headingIcon ? 2 : undefined}>
              {pageHeading}
            </Text>
          </Heading>
        )}
        <Box my={pageHeading ? 5 : 0}>{children}</Box>
      </Box>
    );
  }
);
