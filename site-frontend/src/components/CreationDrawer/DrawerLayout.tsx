import { Flex, Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IDrawerLayoutProps {
  sidebar?: ReactNode;
  contentArea?: ReactNode;
  footer?: ReactNode;
}
export const DrawerLayout = ({
  sidebar,
  contentArea,
  footer,
}: IDrawerLayoutProps) => {
  return (
    <>
      <Flex
        justifyContent="center"
        width="100%"
        maxWidth="100%"
        h="100%"
        margin="auto"
        position="relative"
      >
        <Box
          color="#fff"
          width={["100%", "100%", "35%"]}
          mr={["40px"]}
          as="section"
          position="absolute"
          left="0"
          h="100%"
          p="20px 30px"
          backgroundColor="grey.700"
          maxHeight="100%"
          overflow="auto"
          css={{
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: "24px",
            },
          }}
        >
          {sidebar}
        </Box>
        <Box width={["100%", "100%", "35%"]}></Box>
        <Flex
          display={["none", "none", "inherit"]}
          width={["0%", "0%", "65%"]}
          as="section"
          direction="column"
          alignItems="center"
          overflow="auto"
          justifyContent="center"
          background="grey.50"
        >
          <Flex width="100%" justifyContent="center" maxHeight="100%">
            {contentArea}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
