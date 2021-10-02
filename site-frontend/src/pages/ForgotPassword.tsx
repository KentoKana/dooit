import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { LoadingState } from "../enums/LoadingState";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { generateFirebaseAuthErrorMessage } from "../utils";

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
  const [loadingState, setLoadingSate] = useState<LoadingState>(
    LoadingState.None
  );
  const onSubmit = useCallback(
    (data: { email: string }) => {
      setLoadingSate(LoadingState.Loading);
      sendPasswordResetEmail(auth, data.email)
        .then(() => {
          setLoadingSate(LoadingState.Loaded);
        })
        .catch((error) => {
          const errorMessage = generateFirebaseAuthErrorMessage(error.code);
          setError("serverError", {
            type: "server",
            message: errorMessage,
          });
          setLoadingSate(LoadingState.Error);
        });
    },
    [setError]
  );

  return (
    <Flex
      minHeight="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
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
          <FormControl isInvalid={!!errors.serverError}>
            <FormErrorMessage justifyContent="center">
              {errors.serverError && errors.serverError.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Button
          isLoading={loadingState === LoadingState.Loading}
          type="submit"
          variant="primary"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          Request Reset Link
        </Button>
      </form>
      <Box
        mt="5"
        onClick={() => {
          clearErrors(["serverError"]);
        }}
      >
        <Text as="span" variant="link">
          <Link to="/login">Back to Login Page</Link>
        </Text>
      </Box>
    </Flex>
  );
});
