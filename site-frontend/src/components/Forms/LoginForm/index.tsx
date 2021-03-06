import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { FirebaseError } from "@firebase/util";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { AuthService } from "../../../classes/AuthService";
import { LoadingState } from "../../../enums/LoadingState";
import { LocalRoutes } from "../../../enums/LocalRoutes";
import { UseStores } from "../../../stores/StoreContexts";
import { generateFirebaseAuthErrorMessage } from "../../../utils";

interface ILoginForm {
  email: string;
  password: string;
  serverError: string;
}

export const LoginForm = observer(() => {
  const { userStore, uiStore } = UseStores();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ILoginForm>();

  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion

  const onSubmit = useCallback(
    async (loginFormData: ILoginForm) => {
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore, uiStore);

      return await authService
        .loginWithEmailAndPassword({
          email: loginFormData.email,
          password: loginFormData.password,
        })
        .then(() => {
          userStore.isSignedIn = true;
        })
        .catch((error: FirebaseError) => {
          setLoadingState(LoadingState.Error);
          setError("serverError", {
            type: "server",
            message: generateFirebaseAuthErrorMessage(error.code),
          });
        });
    },
    [userStore, uiStore, setError]
  );

  if (userStore.isSignedIn) {
    return <Redirect to={LocalRoutes.Dashboard} />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.email} mb={3}>
        <FormLabel htmlFor="email" mr={0} mb={2}>
          E-mail:{" "}
        </FormLabel>
        <Input
          disabled={loadingState === LoadingState.Loading}
          id="email"
          type="text"
          placeholder="E-mail"
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
            required: "Please enter your e-mail.",
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.password} mb={3}>
        <FormLabel htmlFor="password" mr={0} mb={2}>
          Password:{" "}
        </FormLabel>
        <Input
          disabled={loadingState === LoadingState.Loading}
          id="password"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Please enter your password.",
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.serverError}>
        <FormErrorMessage justifyContent="center">
          {errors.serverError && errors.serverError.message}
        </FormErrorMessage>
      </FormControl>
      <Flex justifyContent="center">
        <Button
          onClick={() => {
            clearErrors(["serverError"]);
          }}
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
