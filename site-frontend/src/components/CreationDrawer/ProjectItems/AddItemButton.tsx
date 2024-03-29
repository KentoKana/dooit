import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface IAddItemButtonProps {
  onClick: () => void;
}
export const AddItemButton = ({ onClick }: IAddItemButtonProps) => {
  return (
    <Button
      w="85px"
      h="85px"
      marginTop="26px"
      variant="unstyled"
      display="flex"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      flexShrink="inherit"
      onClick={onClick}
    >
      <AddIcon /> Add Step
    </Button>
  );
};
