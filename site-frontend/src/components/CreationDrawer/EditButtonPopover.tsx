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
          id="mediabox"
          width="70px"
          height="70px"
          borderRadius="50%"
          color="#fff"
          title="Edit media"
          variant="primary"
          icon={<EditIcon />}
          aria-label="Edit media"
          onClick={() => {
            onOpen();
          }}
        />
      </PopoverTrigger>
      <PopoverContent maxWidth="200px">
        <PopoverArrow />
        <PopoverBody display="flex" flexDirection="column">
          <Button
            mb={2}
            colorScheme="primary"
            onClick={onCropOptionClick}
            display="flex"
            alignItems="center"
          >
            <Box mr={1}>
              <FiCrop />
            </Box>
            Crop
          </Button>
          <Button
            colorScheme="red"
            display="flex"
            alignItems="center"
            onClick={onRemoveImageClick}
          >
            <DeleteIcon mr={1} /> Remove
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
