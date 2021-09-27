import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

export const Login = observer(() => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      direction="column"
    >
      <Flex direction="column" justifyContent="center" alignItems="center">
        <Heading as="h1" mb="5">
          Log Into{" "}
          <Text as="span" color="primary.100">
            DooIt
          </Text>
        </Heading>
        <LoginForm />
      </Flex>
      <Box mt="5">
        Don't have an account? Sign up{" "}
        <Text as="span" color="primary.100" _hover={{ color: "primary.200" }}>
          <Link to="/signup">here!</Link>
        </Text>
      </Box>
      <Box mt="5">
        <Text as="span" color="primary.100" _hover={{ color: "primary.200" }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </Text>
      </Box>
    </Flex>
  );
});
