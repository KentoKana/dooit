import {
  Box,
  Container,
  Flex,
  ListItem,
  UnorderedList,
  Text,
  Button,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

export const NavBar = observer(() => {
  return (
    <Box>
      <Container maxW="container.xl" height="80px">
        <Flex
          as="nav"
          height="100%"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex>
            <Link to="/">
              <Text>DooIt</Text>
            </Link>
          </Flex>
          <UnorderedList
            display="flex"
            listStyleType="none"
            alignItems="center"
          >
            <ListItem pl={5}>
              <Link to="/signup">
                <Text variant="link" fontWeight="bold">
                  Sign Up
                </Text>
              </Link>
            </ListItem>
            <ListItem pl={5}>
              <Link to="/login">
                <Button variant="primary">
                  Login <UnlockIcon ml={1} />
                </Button>
              </Link>
            </ListItem>
          </UnorderedList>
        </Flex>
      </Container>
    </Box>
  );
});
