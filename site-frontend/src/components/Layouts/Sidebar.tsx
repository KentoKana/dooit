import { Box, ListItem, UnorderedList, Text } from "@chakra-ui/layout";
import { Link } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { LocalRoutes } from "../../enums/LocalRoutes";
import { dashboardRoutes } from "../../routes/dashboardRoutes";
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
          {dashboardRoutes.map((route) => {
            return (
              <ListItem fontWeight="600" key={route.url}>
                <Link
                  onClick={() => {}}
                  as={RouteLink}
                  to={route.url}
                  variant={
                    route.url === selectedLink
                      ? "dashboard_active"
                      : "dashboard_inactive"
                  }
                >
                  <Text ml={5}>{route.label}</Text>
                </Link>
              </ListItem>
            );
          })}
        </UnorderedList>
      </Box>
    </Box>
  );
});
