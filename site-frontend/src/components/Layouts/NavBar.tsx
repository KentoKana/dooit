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
import { UseStores } from "../../stores/StoreContexts";
import { AuthService } from "../../classes/AuthService";
import { useResetQuery } from "../../hooks/useResetQuery";
import { useEffect, useState } from "react";
import { LocalRoutes } from "../../enums/LocalRoutes";

export const NavBar = observer(() => {
  const { userStore, uiStore } = UseStores();
  const authService = new AuthService(userStore, uiStore);
  const reset = useResetQuery();
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    setIsSignedIn(userStore.isSignedIn);
  }, [userStore.isSignedIn]);
  return (
    <Box position="fixed" width="100%" backgroundColor={"white"} top="0">
      <Container maxW="container.xl" height="80px">
        <Flex
          as="nav"
          height="100%"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex>
            <Link
              to={
                userStore.isSignedIn ? LocalRoutes.Dashboard : LocalRoutes.Home
              }
            >
              <Text>DooIt</Text>
            </Link>
          </Flex>
          <UnorderedList
            display="flex"
            listStyleType="none"
            alignItems="center"
          >
            {!isSignedIn ? (
              <>
                <ListItem pl={5}>
                  <Link to={LocalRoutes.SignUp}>
                    <Text variant="link" fontWeight="bold">
                      Sign Up
                    </Text>
                  </Link>
                </ListItem>
                <ListItem pl={5}>
                  <Link to={LocalRoutes.Login}>
                    <Button variant="primary">
                      Login <UnlockIcon ml={1} />
                    </Button>
                  </Link>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem pl={5}>
                  <Link
                    to={LocalRoutes.Home}
                    onClick={() => {
                      authService.signOut();
                      reset();
                    }}
                  >
                    <Button variant="primary">Log Out</Button>
                  </Link>
                </ListItem>
              </>
            )}
          </UnorderedList>
        </Flex>
      </Container>
    </Box>
  );
});
