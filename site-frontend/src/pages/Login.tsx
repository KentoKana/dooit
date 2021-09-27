import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Link as CLink, Spinner } from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { AuthService } from "../classes/AuthService";
import { AuthMethod } from "../enums/AuthMethod";
import { LoadingState } from "../enums/LoadingState";
import { UseStores } from "../stores/StoreContexts";

interface ILoginForm {
  email: string;
  password: string;
}
export const Login = observer(() => {
  const { userStore } = UseStores();
  //#region Local States
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion
  const history = useHistory();
  const handleLogin = useCallback(
    async (authMethod: AuthMethod) => {
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore);
      if (authMethod === AuthMethod.EmailAndPassword) {
        return authService
          .loginWithEmailAndPassword(loginForm.email, loginForm.password)
          .then(() => {
            setLoadingState(LoadingState.Loaded);
          })
          .catch((error) => {
            setLoadingState(LoadingState.Error);
            alert(error);
          });
      }
    },
    [userStore, loginForm]
  );

  if (userStore.user) {
    return <Redirect to="/" />;
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      direction="column"
    >
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading as="h1" mb="5">
          Log Into{" "}
          <Text as="span" color="primary.100">
            DooIt
          </Text>
        </Heading>
        <form>
          <div>
            <FormLabel htmlFor="email" mr={0} mb={3}>
              Email:{" "}
              <Input
                disabled={loadingState === LoadingState.Loading}
                id="email"
                name="email"
                type="email"
                placeholder="E-mail"
                onChange={(e) => {
                  e.persist();
                  setLoginForm((prev) => {
                    return {
                      ...prev,
                      email: e.target.value,
                    };
                  });
                }}
              />
            </FormLabel>
          </div>
          <div>
            <FormLabel htmlFor="password" mr={0} mb={3}>
              Password:{" "}
              <Input
                disabled={loadingState === LoadingState.Loading}
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  e.persist();
                  setLoginForm((prev) => {
                    return {
                      ...prev,
                      password: e.target.value,
                    };
                  });
                }}
              />
            </FormLabel>
          </div>
          <Flex justifyContent="center">
            <Button
              color="white"
              _hover={{ bgColor: "primary.200" }}
              _active={{ bgColor: "primary.200" }}
              bgColor={"primary.100"}
              mt="5"
              width="100%"
              disabled={loadingState === LoadingState.Loading}
              onClick={(e) => {
                e.preventDefault();
                handleLogin(AuthMethod.EmailAndPassword)
                  .then(() => {
                    history.push("/");
                  })
                  .catch((error) => {
                    alert(error);
                  });
              }}
            >
              {loadingState === LoadingState.Loading ? (
                <>
                  Logging you in ... <Spinner />
                </>
              ) : (
                <>Log In</>
              )}
            </Button>
          </Flex>
        </form>
      </Flex>

      <Box mt="5">
        Don't have an account? Sign up{" "}
        <CLink color="primary.100">
          <Link to="/signup">here!</Link>
        </CLink>
      </Box>
    </Flex>
  );
});
