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
      <Flex justifyContent="center" width="100%" maxWidth="900px" margin="auto">
        <Box width="35%" mr={["40px"]} as="section">
          {sidebar}
        </Box>
        <Flex width="65%" as="section" direction="column">
          {contentArea}
        </Flex>
      </Flex>
      <DrawerFooter>{footer}</DrawerFooter>
    </>
  );
};
