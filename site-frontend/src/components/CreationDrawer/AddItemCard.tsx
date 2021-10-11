import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { AiOutlinePlusCircle } from "react-icons/ai";

interface IAddItemCardProps {
  onClick: () => void;
}

export const AddItemCard = observer(({ onClick }: IAddItemCardProps) => {
  return (
    <Button
      borderRadius="sm"
      height={"200px"}
      width={"200px"}
      border="1px solid grey"
      onClick={onClick}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        flexDirection="column"
      >
        <Box>
          <AiOutlinePlusCircle />
        </Box>
        Add Project Item
      </Flex>
    </Button>
  );
});
