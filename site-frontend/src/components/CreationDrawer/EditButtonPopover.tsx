import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  IconButton,
  useDisclosure,
  Button,
  Box,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiCrop } from "react-icons/fi";

interface IEditButtonPopoverProps {
  onTriggerClick: () => void;
  onCropOptionClick: () => void;
  onRemoveImageClick: () => void;
}

export const EditButtonPopover = ({
  onTriggerClick,
  onCropOptionClick,
  onRemoveImageClick,
}: IEditButtonPopoverProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const initialFocusRef = useRef<any>();
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      isOpen={isOpen}
      onOpen={() => {
        onTriggerClick();
        onOpen();
      }}
      onClose={onClose}
    >
      <PopoverTrigger>
        <IconButton
          _hover={{ opacity: 1 }}
          opacity={isOpen ? 1 : 0.8}
          className="mediabox"
          width="60px"
          height="60px"
          borderRadius="50%"
          title="Edit media"
          colorScheme="primary"
          icon={<EditIcon />}
          aria-label="Edit media"
          onClick={() => {
            onOpen();
          }}
        />
      </PopoverTrigger>
      <PopoverContent maxWidth="200px">
        <PopoverArrow />
        <PopoverBody
          display="flex"
          flexDirection="column"
          opacity={isOpen ? 1 : 0.8}
          _hover={{ opacity: 1 }}
        >
          <Button
            borderRadius="sm"
            mb={2}
            colorScheme="primary"
            onClick={onCropOptionClick}
            display="flex"
            alignItems="center"
          >
            <Box mr={1}>
              <FiCrop />
            </Box>
            Crop Image
          </Button>
          <Button
            borderRadius="sm"
            colorScheme="red"
            display="flex"
            alignItems="center"
            onClick={onRemoveImageClick}
          >
            <DeleteIcon mr={1} /> Remove Image
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
