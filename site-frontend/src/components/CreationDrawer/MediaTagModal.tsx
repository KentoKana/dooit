import {
  Box,
  Flex,
  Button,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  useOutsideClick,
  Input,
} from "@chakra-ui/react";
import "./styles.css";
import { ModalTemplate } from "../ModalTemplate";
import { useRef, useState } from "react";
import { FormElement } from "../Forms/FormElement";

interface IMediaTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  onCancel: () => void;
}

interface ITag {
  xCoord: number;
  yCoord: number;
  title: string;
}

export const MediaTagModal = ({
  isOpen,
  onClose,
  mediaUrl,
  onCancel,
}: IMediaTagModalProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [tag, setTag] = useState<ITag>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  useOutsideClick({
    ref: imageRef,
    handler: () => {
      if (!popoverOpen) {
        setTag(undefined);
      }
    },
  });
  const handleClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setPopoverOpen(true);
    // const scaleFactor =
    //   imageRef!.current!.offsetWidth! / imageRef!.current!.offsetWidth;
    const rect = imageRef.current?.getBoundingClientRect();
    const x = e.clientX - rect!.left - 10;
    const y = e.clientY - rect!.top - 10;
    setTag({
      xCoord: x,
      yCoord: y,
      title: "test",
    });
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <Flex justifyContent="flex-end" w="100%" flexWrap="wrap">
          <Button
            borderRadius="sm"
            width="100px"
            onClick={() => {
              onCancel();
            }}
            mr="3"
          >
            Cancel
          </Button>
          <Button
            width="100px"
            variant="primary"
            aria-label="Confirm to crop image"
            alignSelf="end"
            onClick={() => {
              onClose();
            }}
          >
            Done
          </Button>
        </Flex>
      }
    >
      <Box
        className="crop-container"
        css={{
          width: "100%",
          position: "relative",
          background: "#333",
        }}
      >
        <Image
          cursor={"crosshair"}
          position="relative"
          ref={imageRef}
          src={mediaUrl}
          zIndex={1}
          onClick={(e) => {
            handleClick(e);
          }}
        />
        <Popover
          returnFocusOnClose={false}
          isOpen={popoverOpen}
          onClose={() => {
            setPopoverOpen(false);
          }}
          placement="bottom"
        >
          {tag && (
            <PopoverTrigger>
              <Box
                zIndex={3}
                position="absolute"
                height="20px"
                width="20px"
                borderRadius="50%"
                border="5px solid"
                borderColor="primary"
                top={tag?.yCoord ?? 0}
                left={tag?.xCoord ?? 0}
                background="#fff"
              ></Box>
            </PopoverTrigger>
          )}
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <FormElement
                isInvalid={false}
                formLabel="Title"
                formFor="tag"
                formField={
                  <Input id="tag" placeholder="E.g. '3x2 Hardwood Board'..." />
                }
              />
              <FormElement
                isInvalid={false}
                formLabel="URL (Optional)"
                formFor="url"
                formField={<Input id="url" placeholder={"https://"} />}
              />
            </PopoverBody>
            <PopoverFooter d="flex" justifyContent="flex-end">
              <ButtonGroup size="sm">
                <Button
                  variant="outline"
                  borderRadius="sm"
                  onClick={() => {
                    setPopoverOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button colorScheme="primary" borderRadius="sm">
                  Add Tag
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </Box>
    </ModalTemplate>
  );
};
