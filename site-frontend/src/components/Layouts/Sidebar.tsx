import { Box, ListItem, UnorderedList } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { LocalRoutes } from "../../enums/LocalRoutes";

export const Sidebar = observer(() => {
  return (
    <Box>
      <Box as="nav" borderRadius={5}>
        <UnorderedList listStyleType="none">
          <ListItem fontSize="18px" fontWeight="600">
            <Text color="primary">
              <Link to={LocalRoutes.Dashboard}>Dashboard</Link>
            </Text>
          </ListItem>
          <ListItem>Hi</ListItem>
          <ListItem>Hi</ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
});
