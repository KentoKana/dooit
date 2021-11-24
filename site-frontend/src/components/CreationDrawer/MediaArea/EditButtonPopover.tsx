import { DeleteIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import { ActionConfirmationModal } from "../ActionConfirmationModal";

interface IEditButtonProps {
  onRemoveImageClick: () => void;
}

export const EditButton = ({ onRemoveImageClick }: IEditButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        opacity={0.8}
        position="absolute"
        zIndex={2}
        top={0}
        right={0}
        m="5px"
        _hover={{ opacity: 1 }}
        className="mediabox"
        width="40px"
        height="40px"
        title="Delete media"
        icon={<DeleteIcon />}
        aria-label="Edit media"
        borderRadius="sm"
        colorScheme="red"
        display="flex"
        alignItems="center"
        onClick={onOpen}
      />
      <ActionConfirmationModal
        modalHeading="Are you sure you'd like to remove this image?"
        isOpen={isOpen}
        onCancel={onClose}
        confirmButtonLabel="Yes"
        confirmButtonColorScheme="red"
        onConfirm={onRemoveImageClick}
      />
    </>
  );
};
