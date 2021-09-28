import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { LoadingState } from "../enums/LoadingState";
import { Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const ForgotPassword = observer(() => {
  const [email, setEmail] = useState("");
  const [loadingState, setLoadingSate] = useState<LoadingState>(
    LoadingState.None
  );
  const handleResetPasswordRequest = useCallback(() => {
    setLoadingSate(LoadingState.Loading);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoadingSate(LoadingState.Loaded);
      })
      .catch((error) => {
        alert(error);
        setLoadingSate(LoadingState.Error);
      });
  }, [email]);

  const handleUserKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      event.preventDefault();
      if (key === "Enter") {
        handleResetPasswordRequest();
      }
    },
    [handleResetPasswordRequest]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <Flex
      height="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Heading as="h1" mb="50">
        Reset Your Password
      </Heading>
      <form>
        <Box mb="5">
          <FormLabel htmlFor="email">E-mail:</FormLabel>
          <Input
            id="email"
            value={email}
            onChange={(e) => {
              e.persist();
              setEmail(e.target.value);
            }}
          />
        </Box>
        <Button
          variant="primary"
          width="100%"
          onClick={() => handleResetPasswordRequest()}
          disabled={loadingState === LoadingState.Loading}
        >
          {loadingState === LoadingState.Loading ? (
            <>
              Sending... <Spinner />
            </>
          ) : (
            "Request Reset Link"
          )}
        </Button>
      </form>
      <Box mt="5">
        <Text as="span" variant="link">
          <Link to="/login">Back to Login Page</Link>
        </Text>
      </Box>
    </Flex>
  );
});
