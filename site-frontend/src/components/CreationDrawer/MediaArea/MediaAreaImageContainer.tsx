import {
  Box,
  Button,
  Image,
  useOutsideClick,
  Flex,
  Tag,
  Text,
} from "@chakra-ui/react";
import "../styles.css";
import { useState } from "react";
import { AiFillTag } from "react-icons/ai";
import { UseFormReturn } from "react-hook-form";
import { IProject } from "../index";
import { ImageTagPopover } from "./ImageTagPopover";

interface IMediaAreaImageContainerProps {
  mediaUrl: string;
  imageRef: React.RefObject<HTMLImageElement>;
  formHook: UseFormReturn<IProject, object>;
  selectedItemIndex: number;
}

export interface ITag {
  xCoord: number;
  yCoord: number;
  title: string;
  url?: string;
  originalImageWidth: number;
}

export const MediaAreaImageContainer = ({
  mediaUrl,
  imageRef,
  formHook,
  selectedItemIndex,
}: IMediaAreaImageContainerProps) => {
  const [tagPopover, setTagPopover] = useState<ITag>();
  const [_, setTags] = useState<ITag[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);
  useOutsideClick({
    ref: imageRef,
    handler: () => {
      if (!popoverOpen) {
        setTagPopover(undefined);
        setPopoverOpen(false);
      }
    },
  });
  const handleAddTag = () => {
    setTags((prev) => {
      let newTagsState = [...prev];
      if (tagPopover) {
        newTagsState = [...newTagsState, tagPopover];
      }
      formHook.setValue(
        `projectItems.${selectedItemIndex}.tags.${prev.length}`,
        {
          xCoord: tagPopover!.xCoord!,
          yCoord: tagPopover!.yCoord!,
          title: tagPopover?.title!,
          url: tagPopover?.url,
          originalImageWidth: tagPopover?.originalImageWidth!,
        }
      );
      return newTagsState;
    });
    setTagPopover(undefined);
    setPopoverOpen(false);
  };
  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setPopoverOpen(true);
    // const scaleFactor =
    //   imageRef!.current!.offsetWidth! / imageRef!.current!.offsetWidth;
    const rect = imageRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect!.left - 10;
    const y = e.clientY - rect!.top - 10;
    setTagPopover({
      xCoord: x,
      yCoord: y,
      title: "",
      url: "",
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
          transition={"0.2s ease all"}
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
          <ImageTagPopover
            currentTagPopoverState={tagPopover}
            formHook={formHook}
            selectedItemIndex={selectedItemIndex}
            isOpen={popoverOpen}
            onClose={() => {
              setPopoverOpen(false);
              setTagPopover(undefined);
            }}
            onImageClick={(newTag) => {
              setPopoverOpen(true);
              setTagPopover(newTag);
            }}
            onTitleChange={(newTitle) => {
              setTagPopover((prev) => {
                if (prev) {
                  return {
                    ...prev,
                    title: newTitle,
                  };
                }
                return prev;
              });
            }}
            onUrlChange={(newUrl) => {
              setTagPopover((prev) => {
                if (prev) {
                  return {
                    ...prev,
                    url: newUrl,
                  };
                }
                return prev;
              });
            }}
            onAddTag={handleAddTag}
          />
        )}
      </Box>
      <Flex
        mt={3}
        justifyContent="flex-end"
        alignItems="flex-start"
        width="100%"
      >
        <Box>
          {formHook
            .getValues(`projectItems.${selectedItemIndex}.tags`)
            ?.map((tag, index) => {
              return (
                <Button
                  variant="unstyled"
                  onClick={() => {
                    setPopoverOpen(true);
                    setTagPopover(tag);
                  }}
                >
                  <Tag key={index} m={1} colorScheme="cyan" size="lg">
                    {tag.title}
                  </Tag>
                </Button>
              );
            })}
        </Box>
        <Box>
          <Button
            borderRadius="sm"
            mt={1}
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
        </Box>
      </Flex>
    </>
  );
};
