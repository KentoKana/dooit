import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Flex, FormErrorMessage, useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LoadingState } from "../../../enums/LoadingState";
import { useReset } from "../../../hooks/useReset";
import { AuthService } from "../../../classes/AuthService";
import { UseStores } from "../../../stores/StoreContexts";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { generateFirebaseAuthErrorMessage } from "../../../utils";
import { FirebaseError } from "@firebase/util";

interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface ISignUpFormProps {
  onCreate: () => void;
}
export const SignUpForm = observer(({ onCreate }: ISignUpFormProps) => {
  const { uiStore, userStore } = UseStores();
  const toast = useToast();
  const reset = useReset();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion
  const onSubmit = useCallback(
    async (formData: ISignUpForm) => {
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore, uiStore);
      authService
        .createUserWithEmailAndPassword({
          id: "",
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          email: formData.email,
        })
        .then(() => {
          setLoadingState(LoadingState.Loaded);
          toast({
            title: `Congratulations, You've created your account!`,
            status: "success",
            isClosable: true,
            position: "top",
          });
        })
        .catch((error: FirebaseError) => {
          setError("serverError", {
            type: "server",
            message: generateFirebaseAuthErrorMessage(error.code),
          });
          setLoadingState(LoadingState.Error);
          reset();
        });
    },
    [uiStore, userStore, reset, setError, toast]
  );

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
            required: "Please enter your e-mail.",
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
          Sign Up!
        </Button>
      </Flex>
    </form>
  );
});
