import {
  Box,
  Button,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  ButtonGroup,
  useOutsideClick,
  Input,
  Flex,
  Tag,
  Text,
} from "@chakra-ui/react";
import "./styles.css";
import { useState } from "react";
import { FormElement } from "../Forms/FormElement";
import { AiFillTag } from "react-icons/ai";

interface IMediaAreaImageContainerProps {
  mediaUrl: string;
  imageRef: React.RefObject<HTMLImageElement>;
}

interface ITag {
  xCoord: number;
  yCoord: number;
  title: string;
  originalImageWidth: number;
}

export const MediaAreaImageContainer = ({
  mediaUrl,
  imageRef,
}: IMediaAreaImageContainerProps) => {
  const [tagPopover, setTagPopover] = useState<ITag>();
  const [tags, setTags] = useState<ITag[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);
  useOutsideClick({
    ref: imageRef,
    handler: () => {
      if (!popoverOpen) {
        setTagPopover(undefined);
      }
    },
  });
  const handleAddTag = () => {
    setTags((prev) => {
      let newTagsState = [...prev];
      if (tagPopover) {
        newTagsState = [...newTagsState, tagPopover];
      }
      return newTagsState;
    });
    setTagPopover(undefined);
    setPopoverOpen(false);
  };
  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setPopoverOpen(true);
    if (popoverOpen) {
      document.getElementById("");
    }
    // const scaleFactor =
    //   imageRef!.current!.offsetWidth! / imageRef!.current!.offsetWidth;
    const rect = imageRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect!.left - 10;
    const y = e.clientY - rect!.top - 10;
    setTagPopover({
      xCoord: x,
      yCoord: y,
      title: "",
      originalImageWidth: imageRef!.current!.offsetWidth,
    });
  };

  return (
    <>
      <Box
        className="crop-container"
        css={{
          width: "100%",
          position: "relative",
          background: "#333",
        }}
      >
        <Image
          ref={imageRef}
          borderRadius="sm"
          width="100%"
          src={mediaUrl}
          position="relative"
        />
        <Box
          cursor={isTagMode ? "crosshair" : "default"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          bottom="0"
          w="100%"
          h="100%"
          top="0"
          bg={isTagMode ? "rgba(0,0,0,0.3)" : "transparent"}
          onClick={(e) => {
            if (isTagMode) {
              handleImageClick(e);
            }
          }}
        >
          {isTagMode && (
            <Text as="span" color="#fff">
              Tap to add tags
            </Text>
          )}
        </Box>
        {isTagMode && (
          <Popover
            returnFocusOnClose={false}
            isOpen={popoverOpen}
            onClose={() => {
              setPopoverOpen(false);
            }}
            placement="bottom"
          >
            {tagPopover && (
              <PopoverTrigger>
                <Box
                  zIndex={3}
                  position="absolute"
                  height="20px"
                  width="20px"
                  borderRadius="50%"
                  border="5px solid"
                  borderColor="primary"
                  top={tagPopover?.yCoord ?? 0}
                  left={tagPopover?.xCoord ?? 0}
                  background="#fff"
                ></Box>
              </PopoverTrigger>
            )}
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <FormElement
                  isInvalid={false}
                  formLabel="Title"
                  formFor="tagTitle"
                  formField={
                    <Input
                      value={tagPopover?.title}
                      id="tagTitle"
                      placeholder="E.g. '3x2 Hardwood Board'..."
                      borderRadius="sm"
                      onChange={(e) => {
                        setTagPopover((prev) => {
                          if (prev) {
                            return {
                              ...prev,
                              title: e.target.value,
                            };
                          }
                          return prev;
                        });
                      }}
                    />
                  }
                />
                <FormElement
                  isInvalid={false}
                  formLabel="URL (Optional)"
                  formFor="url"
                  formField={
                    <Input
                      id="url"
                      placeholder={"https://"}
                      borderRadius="sm"
                    />
                  }
                />
              </PopoverBody>
              <PopoverFooter d="flex" justifyContent="flex-end">
                <ButtonGroup size="sm">
                  <Button
                    borderRadius="sm"
                    onClick={() => {
                      setPopoverOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="primary"
                    borderRadius="sm"
                    onClick={handleAddTag}
                  >
                    Add Tag
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        )}
      </Box>
      <Flex mt={3} justifyContent="flex-end" alignItems="center">
        <Box>
          {tags.map((tag, index) => {
            return (
              <Tag key={index} mr={2} colorScheme="cyan" size="lg">
                {tag.title}
              </Tag>
            );
          })}
        </Box>
        <Button
          size="sm"
          colorScheme={isTagMode ? "primary" : "yellow"}
          onClick={() => {
            setIsTagMode(!isTagMode);
          }}
        >
          {isTagMode ? (
            "Done Tagging"
          ) : (
            <Text as="span" display="flex" alignItems="center">
              <Box as="span" mr={1} mt={1}>
                <AiFillTag />
              </Box>{" "}
              Tag Image
            </Text>
          )}
        </Button>
      </Flex>
    </>
  );
};
