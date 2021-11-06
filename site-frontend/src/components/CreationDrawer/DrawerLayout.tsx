import { Flex, Box, DrawerFooter } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IDrawerLayoutProps {
  sidebar: ReactNode;
  contentArea: ReactNode;
  footer: ReactNode;
}
export const DrawerLayout = ({
  sidebar,
  contentArea,
  footer,
}: IDrawerLayoutProps) => {
  return (
    <>
      <Flex
        justifyContent="between"
        width="100%"
        maxWidth="1200px"
        margin="auto"
      >
        <Box width="25%" mr={["40px"]} as="section">
          {sidebar}
        </Box>
        <Flex
          width="75%"
          as="section"
          justifyContent="center"
          direction="column"
          alignItems="center"
        >
          {contentArea}
        </Flex>
      </Flex>
      <DrawerFooter>{footer}</DrawerFooter>
    </>
  );
};
