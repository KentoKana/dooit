import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { LoginForm } from "../components/Forms/LoginForm";
import { LocalRoutes } from "../enums/LocalRoutes";

export const Login = observer(() => {
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
          Log Into{" "}
          <Text as="span" color="primary">
            DooIt
          </Text>
        </Heading>
        <LoginForm />
      </Flex>
      <Box mt="5">
        Don't have an account? Sign up{" "}
        <Text as="span" variant="link">
          <Link to={LocalRoutes.SignUp}>here!</Link>
        </Text>
      </Box>
      <Box mt="5">
        <Text as="span" variant="link">
          <Link to={LocalRoutes.ForgotPassword}>Forgot Password?</Link>
        </Text>
      </Box>
    </Flex>
  );
});
