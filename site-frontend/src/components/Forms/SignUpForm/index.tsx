import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, FormErrorMessage } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LoadingState } from "../../../enums/LoadingState";
import { useResetQuery } from "../../../hooks/useResetQuery";
import { AuthService } from "../../../classes/AuthService";
import { UseStores } from "../../../stores/StoreContexts";
import { auth } from "../../../firebase";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { isNullOrUndefined } from "../../../utils";
import { Redirect } from "react-router";
interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const SignUpForm = observer(() => {
  const { uiStore, userStore } = UseStores();
  const reset = useResetQuery();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  const [creationSuccessful, setCreationSuccessful] = useState(false);
  //#endregion
  const onSubmit = useCallback(
    async (formData: ISignUpForm) => {
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore);
      authService
        .createUserWithEmailAndPassword(formData.email, formData.password)
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
                .apiRequest<ISignUpForm>("http://localhost:4000/user", {
                  method: "POST",
                  bodyData: formData,
                })
                .then(() => {
                  setLoadingState(LoadingState.Loaded);
                  setCreationSuccessful(true);
                })
                .catch(() => {
                  setLoadingState(LoadingState.Error);
                  // Delete user from Firebase if API fails
                  reset();
                  auth.currentUser?.delete();
                });
            });
        })
        .catch((error) => {
          setLoadingState(LoadingState.Error);
          alert(error);
        });
    },
    [uiStore, userStore, reset]
  );

  if (!isNullOrUndefined(userStore.userToken) && creationSuccessful) {
    userStore.isSignedIn = true;
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.firstName} mb={3}>
        <FormLabel htmlFor="firstName" mr={0} mb={2}>
          First Name:{" "}
        </FormLabel>
        <Input
          id="firstName"
          disabled={loadingState === LoadingState.Loading}
          placeholder="First Name"
          {...register("firstName", {
            required: "Please enter your first name.",
          })}
        />
        <FormErrorMessage>
          {errors.firstName && errors.firstName.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.lastName} mb={3}>
        <FormLabel htmlFor="lastName" mr={0} mb={2}>
          Last Name:{" "}
        </FormLabel>
        <Input
          disabled={loadingState === LoadingState.Loading}
          id="lastName"
          type="text"
          placeholder="Last Name"
          {...register("lastName", {
            required: "Please enter your last name.",
          })}
        />
        <FormErrorMessage>
          {errors.lastName && errors.lastName.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.email} mb={3}>
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
            required: "Please enter your email.",
          })}
        />
        <FormErrorMessage>
          {errors.email && errors.email.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password} mb={3}>
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
      <Flex justifyContent="center">
        <Button
          isLoading={isSubmitting}
          type="submit"
          variant="primary"
          mt="5"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          Sign Up!
        </Button>
      </Flex>
    </form>
  );
});
