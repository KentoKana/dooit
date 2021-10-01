import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { FormEvent, useCallback, useState } from "react";
import { Redirect } from "react-router-dom";
import { AuthService } from "../../../classes/AuthService";
import { LoadingState } from "../../../enums/LoadingState";
import { UseStores } from "../../../stores/StoreContexts";
import { isNullOrUndefined } from "../../../utils";

interface ILoginForm {
  email: string;
  password: string;
}

export const LoginForm = observer(() => {
  const { userStore } = UseStores();

  //#region Local States
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);
  //#endregion

  const handleLogin = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore);
      return authService
        .loginWithEmailAndPassword(loginForm.email, loginForm.password)
        .then(() => {
          setLoadingState(LoadingState.Loaded);
          setHasLoggedIn(true);
        })
        .catch((error) => {
          setLoadingState(LoadingState.Error);
          alert(error);
        });
    },
    [userStore, loginForm]
  );

  if (!isNullOrUndefined(userStore.userToken) && hasLoggedIn) {
    userStore.isSignedIn = true;
    return <Redirect to="/" />;
  }
  return (
    <form onSubmit={handleLogin}>
      <div>
        <FormLabel htmlFor="email" mr={0} mb={2}>
          Email:{" "}
        </FormLabel>
        <Input
          mb={3}
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
      </div>
      <div>
        <FormLabel htmlFor="password" mr={0} mb={2}>
          Password:{" "}
        </FormLabel>
        <Input
          mb={3}
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
      </div>
      <Flex justifyContent="center">
        <Button
          isLoading={loadingState === LoadingState.Loading}
          type="submit"
          variant="primary"
          mt="5"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          Log In
        </Button>
      </Flex>
    </form>
  );
});
