import { Box, ListItem, UnorderedList, Text } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { LocalRoutes } from "../../enums/LocalRoutes";
import { sidebarRoutes } from "../../routes/sidebarRoutes";
import { useLocation } from "react-router-dom";

export const Sidebar = observer(() => {
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
        </UnorderedList>
      </Box>
    </Box>
  );
});
