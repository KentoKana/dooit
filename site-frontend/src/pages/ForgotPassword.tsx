import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { LoadingState } from "../enums/LoadingState";
import { FormControl, FormErrorMessage, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthService } from "../classes/AuthService";
import { UseStores } from "../stores/StoreContexts";
import { generateFirebaseAuthErrorMessage, isNullOrUndefined } from "../utils";
import { LocalRoutes } from "../enums/LocalRoutes";
import { FirebaseError } from "@firebase/util";

interface IForgotPasswordForm {
  email: string;
  serverError: string;
}
export const ForgotPassword = observer(() => {
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<IForgotPasswordForm>({ reValidateMode: "onSubmit" });
  const { uiStore, userStore } = UseStores();
  const [loadingState, setLoadingSate] = useState<LoadingState>(
    LoadingState.None
  );
  const toast = useToast();
  const onSubmit = useCallback(
    (data: { email: string }) => {
      setLoadingSate(LoadingState.Loading);
      const authService = new AuthService(userStore, uiStore);
      authService
        .resetPassword(data.email)
        .then(async () => {
          setLoadingSate(LoadingState.Loaded);
          toast({
            title: "Sent!",
            description:
              "We sent an e-mail with your password reset link. Please check your email.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((error: FirebaseError) => {
          setError("serverError", {
            type: "server",
            message: generateFirebaseAuthErrorMessage(error.code),
          });
          setLoadingSate(LoadingState.Error);
        });
    },
    [setError, toast, uiStore, userStore]
  );

  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
      padding="20px"
    >
      <Heading as="h1" mb="50">
        Reset Your Password
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb="5">
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
          <FormControl isInvalid={!isNullOrUndefined(errors.serverError)}>
            <FormErrorMessage justifyContent="center">
              {errors.serverError && errors.serverError.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Button
          onClick={() => {
            clearErrors(["serverError"]);
          }}
          isLoading={loadingState === LoadingState.Loading}
          type="submit"
          variant="primary"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          Request Reset Link
        </Button>
      </form>
      <Box mt="5">
        <Text as="span" variant="link">
          <Link to={LocalRoutes.Login}>Back to Login Page</Link>
        </Text>
      </Box>
    </Flex>
  );
});
