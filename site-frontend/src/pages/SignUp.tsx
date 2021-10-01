import { observer } from "mobx-react-lite";
import { UseStores } from "../stores/StoreContexts";
import { isNullOrUndefined } from "../utils";
import { SignUpForm } from "../components/Forms/SignUpForm";
import { Redirect } from "react-router";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Link } from "react-router-dom";

export const SignUp = observer(() => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      direction="column"
    >
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading as="h1" mb="5">
          Sign Up
        </Heading>
        <SignUpForm />
      </Flex>
      <Box mt="5">
        Already have an account? Log in{" "}
        <Text as="span" variant="link">
          <Link to="/login">here!</Link>
        </Text>
      </Box>
    </Flex>
  );
});
