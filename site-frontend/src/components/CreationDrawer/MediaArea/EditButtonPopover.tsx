import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

interface IEditButtonPopoverProps {
  onRemoveImageClick: () => void;
}

export const EditButtonPopover = ({
  onRemoveImageClick,
}: IEditButtonPopoverProps) => {
  return (
    <IconButton
      position="absolute"
      zIndex={2}
      top={0}
      right={0}
      m="5px"
      _hover={{ opacity: 1 }}
      className="mediabox"
      width="60px"
      height="60px"
      title="Edit media"
      icon={<DeleteIcon />}
      aria-label="Edit media"
      borderRadius="sm"
      colorScheme="red"
      display="flex"
      alignItems="center"
      onClick={onRemoveImageClick}
    />
  );
};
