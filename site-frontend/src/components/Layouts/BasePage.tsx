import { Box, Container, Flex, useMediaQuery } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback } from "react";
import { BreakPoints } from "../../enums/BreakPoints";
import { UseStores } from "../../stores/StoreContexts";
import { Sidebar } from "./Sidebar";

interface IBasePageProps {
  showSidebar: boolean;
  children: ReactNode;
}
export const BasePage = observer(
  ({ children, showSidebar }: IBasePageProps) => {
    const { userStore } = UseStores();
    const [showMobileLayout] = useMediaQuery(BreakPoints.Mobile);

    const getDesktopWidths = useCallback(() => {
      let sidebar = "20%";
      let main = "80%";
      if (!showSidebar) {
        main = "100%";
      }
      return {
        sidebar: sidebar,
        main: main,
      };
    }, [userStore.isSignedIn]);

    return (
      <Container
        maxW="container.xl"
        as="div"
        marginTop="100px"
        p={showMobileLayout ? 0 : undefined}
      >
        <Flex>
          {userStore.isSignedIn && showSidebar && (
            <Box width={getDesktopWidths().sidebar} pr={5}>
              <Sidebar />
            </Box>
          )}
          <Box width={getDesktopWidths().main}>{children}</Box>
        </Flex>
      </Container>
    );
  }
);
