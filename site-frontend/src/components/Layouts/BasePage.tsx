import { Box, Container, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback } from "react";
import { UseStores } from "../../stores/StoreContexts";
import { Sidebar } from "./Sidebar";

interface IBasePageProps {
  children: ReactNode;
}
export const BasePage = observer(({ children }: IBasePageProps) => {
  const { userStore } = UseStores();

  const getDesktopWidths = useCallback(() => {
    let sidebar = "20%";
    let main = "80%";
    if (!userStore.isSignedIn) {
      main = "100%";
    }
    return {
      sidebar: sidebar,
      main: main,
    };
  }, [userStore.isSignedIn]);

  return (
    <Container maxW="container.xl" as="div">
      <Flex>
        {userStore.isSignedIn && (
          <Box width={getDesktopWidths().sidebar} pr={5}>
            <Sidebar />
          </Box>
        )}
        <Box width={getDesktopWidths().main}>{children}</Box>
      </Flex>
    </Container>
  );
});
