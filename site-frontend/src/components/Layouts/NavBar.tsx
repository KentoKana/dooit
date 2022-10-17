import {
  Box,
  Container,
  Flex,
  ListItem,
  UnorderedList,
  Text,
  Button,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { UseStores } from "../../stores/StoreContexts";
import { useEffect, useState } from "react";
import { LocalRoutes } from "../../enums/LocalRoutes";
import { AiOutlinePlus } from "react-icons/ai";
import { CreationDrawer } from "../CreationDrawer";
import { LoadingState } from "../../enums/LoadingState";

export const NavBar = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectCreationState, setProjectCreationState] =
    useState<LoadingState>(LoadingState.None);
  // const history = useHistory();

  const { userStore } = UseStores();
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    setIsSignedIn(userStore.isSignedIn);
  }, [userStore.isSignedIn]);

  return (
    <Box
      position="fixed"
      width="100%"
      backgroundColor={"white"}
      top="0"
      zIndex={2}
    >
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
              <Text>ForkIt</Text>
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
                  <Button
                    variant="outline"
                    onClick={onOpen}
                    disabled={projectCreationState === LoadingState.Loading}
                  >
                    <Text as="span" display="flex" alignItems="center">
                      {projectCreationState === LoadingState.Loading ? (
                        <>
                          <Text as="span" mr={1} marginTop="3px">
                            <Spinner />
                          </Text>{" "}
                          Creating Project...
                        </>
                      ) : (
                        <>
                          <Text as="span" mr={1} marginTop="3px">
                            <AiOutlinePlus />
                          </Text>{" "}
                          Create
                        </>
                      )}
                    </Text>
                  </Button>
                </ListItem>
              </>
            )}
          </UnorderedList>
        </Flex>
      </Container>
      {userStore.isSignedIn && (
        <CreationDrawer
          onClose={onClose}
          isOpen={isOpen}
          onProjectCreation={(creationState) => {
            setProjectCreationState(creationState);
            onOpen();
          }}
        />
      )}
    </Box>
  );
});
