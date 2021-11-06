import { observer } from "mobx-react-lite";
import { SignUpForm } from "../components/Forms/SignUpForm";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Link, Redirect } from "react-router-dom";
import { LocalRoutes } from "../enums/LocalRoutes";
import { isNullOrUndefined } from "../utils";
import { useState } from "react";
import { UseStores } from "../stores/StoreContexts";

export const SignUp = observer(() => {
  const { userStore } = UseStores();

  const [created, setCreated] = useState(false);
  if (
    (created && !isNullOrUndefined(localStorage.getItem("user-jwt"))) ||
    userStore.isSignedIn
  ) {
    return <Redirect to="/" />;
  }

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      // minHeight="100vh"
      direction="column"
      padding="20px"
    >
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading as="h1" mb="5">
          Sign Up
        </Heading>
        <SignUpForm
          onCreate={() => {
            setCreated(true);
          }}
        />
      </Flex>
      <Box mt="5">
        Already have an account? Log in{" "}
        <Text as="span" variant="link">
          <Link to={LocalRoutes.Login}>here!</Link>
        </Text>
      </Box>
    </Flex>
  );
});
