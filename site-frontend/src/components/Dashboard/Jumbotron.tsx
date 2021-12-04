import { Box, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { UseStores } from "../../stores/StoreContexts";

export const Jumbotron = observer(() => {
  const { userStore } = UseStores();
  return (
    <Box
      w="100%"
      h="100px"
      //   bgColor="primary"
      borderRadius={3}
      p={5}
      style={gradient}
    >
      <Heading as="h1">Howdy, {userStore.user?.displayName}!</Heading>
    </Box>
  );
});

const gradient = {
  background:
    "linear-gradient(90deg, hsla(177, 87%, 79%, 1) 0%, hsla(235, 89%, 70%, 1) 100%)",
  filter:
    'progid: DXImageTransform.Microsoft.gradient( startColorstr="#9BF8F4", endColorstr="#6F7BF7", GradientType=1 )',
};
