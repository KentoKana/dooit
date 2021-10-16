import { Box, ListItem, UnorderedList, Text } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { LocalRoutes } from "../../enums/LocalRoutes";
import { sidebarRoutes } from "../../routes/sidebarRoutes";
import { useLocation } from "react-router-dom";
import { UseStores } from "../../stores/StoreContexts";
import { AuthService } from "../../classes/AuthService";
import { useReset } from "../../hooks/useReset";
import { AiOutlinePoweroff } from "react-icons/ai";

export const Sidebar = observer(() => {
  const { uiStore, userStore } = UseStores();
  const reset = useReset();
  const authService = new AuthService(userStore, uiStore);
  const [selectedLink, setSelectedLink] = useState<LocalRoutes>(
    LocalRoutes.Dashboard
  );
  const location = useLocation();

  useEffect(() => {
    const currentPathname = location.pathname;
    setSelectedLink(currentPathname as LocalRoutes);
  }, [location]);

  return (
    <Box>
      <Box as="nav" borderRadius={5}>
        <UnorderedList listStyleType="none">
          {sidebarRoutes.map((route) => {
            return (
              <ListItem fontWeight="600" key={route.url}>
                <Link
                  ml={5}
                  as={RouteLink}
                  to={route.url}
                  variant={
                    route.url === selectedLink
                      ? "dashboard_active"
                      : "dashboard_inactive"
                  }
                >
                  <Text as="span" display="flex" alignItems="center">
                    <Text as="span" mr={2}>
                      {route.icon}
                    </Text>{" "}
                    {route.label}
                  </Text>
                </Link>
              </ListItem>
            );
          })}
          <ListItem fontWeight="600">
            <Link
              mt={20}
              ml={5}
              as={RouteLink}
              to={"/"}
              variant={"dashboard_inactive"}
              onClick={() => {
                authService.signOut();
                reset();
              }}
            >
              <Text as="span" display="flex" alignItems="center">
                <Text as="span" mr={2}>
                  <AiOutlinePoweroff />
                </Text>{" "}
                Log Out
              </Text>
            </Link>
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
});
