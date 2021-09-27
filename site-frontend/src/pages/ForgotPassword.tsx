import { Button } from "@chakra-ui/button";
import { FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Heading } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";

export const ForgotPassword = observer(() => {
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
          <Input id="email" />
        </Box>
        <Button width="100%">Request Reset Link</Button>
      </form>
    </Flex>
  );
});
