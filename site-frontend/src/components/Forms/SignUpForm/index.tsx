import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, Spinner } from "@chakra-ui/react";
import { FormEvent, useCallback, useState } from "react";
import { LoadingState } from "../../../enums/LoadingState";
import { useResetQuery } from "../../../hooks/useResetQuery";
import { useHistory } from "react-router";
import { AuthService } from "../../../classes/AuthService";
import { UseStores } from "../../../stores/StoreContexts";
import { auth } from "../../../firebase";
interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const SignUpForm = () => {
  //#region Local States
  const [signupForm, setSignUpForm] = useState<ISignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  const reset = useResetQuery();
  const { uiStore, userStore } = UseStores();

  //#endregion
  const history = useHistory();
  const handleSignUp = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore);
      authService
        .createUserWithEmailAndPassword(signupForm.email, signupForm.password)
        .then((userCred) => {
          userCred.user
            .getIdToken()
            .then(async (token) => {
              localStorage.setItem("user-jwt", token);
              userStore.userToken = token;
              return token;
            })
            .then((token) => {
              userStore.userToken = token;
              uiStore
                .apiRequest<{ id: string }>("http://localhost:4000/usder", {
                  method: "POST",
                  bodyData: { id: token },
                })
                .then((d) => {
                  console.log(d);
                  setLoadingState(LoadingState.Loaded);
                  reset();
                  auth.currentUser?.delete();
                  history.push("/");
                })
                .catch(() => {
                  setLoadingState(LoadingState.Error);
                  // Delete user from Firebase if API fails
                });
            });
        })
        .catch((error) => {
          setLoadingState(LoadingState.Error);
          alert(error);
        });
    },
    [uiStore, userStore, history, signupForm, reset]
  );
  return (
    <form onSubmit={handleSignUp}>
      <div>
        <FormLabel htmlFor="firstName" mr={0} mb={2}>
          First Name:{" "}
        </FormLabel>
        <Input
          mb={3}
          disabled={loadingState === LoadingState.Loading}
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={(e) => {
            e.persist();
            setSignUpForm((prev) => {
              return {
                ...prev,
                firstName: e.target.value,
              };
            });
          }}
        />
        <FormLabel htmlFor="lastName" mr={0} mb={2}>
          Last Name:{" "}
        </FormLabel>
        <Input
          mb={3}
          disabled={loadingState === LoadingState.Loading}
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last Name"
          onChange={(e) => {
            e.persist();
            setSignUpForm((prev) => {
              return {
                ...prev,
                lastName: e.target.value,
              };
            });
          }}
        />
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
            setSignUpForm((prev) => {
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
            setSignUpForm((prev) => {
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
          type="submit"
          variant="primary"
          mt="5"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          {loadingState === LoadingState.Loading ? (
            <>
              Creating Account ... <Spinner />
            </>
          ) : (
            <>Sign Up!</>
          )}
        </Button>
      </Flex>
    </form>
  );
};
