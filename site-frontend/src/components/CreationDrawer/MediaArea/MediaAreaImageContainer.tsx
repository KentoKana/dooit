import {
  Box,
  Button,
  Image,
  useOutsideClick,
  Flex,
  Text,
} from "@chakra-ui/react";
import "../styles.css";
import { useCallback, useState } from "react";
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
  isEditMode: boolean;
}

export const MediaAreaImageContainer = ({
  mediaUrl,
  imageRef,
  formHook,
  selectedItemIndex,
}: IMediaAreaImageContainerProps) => {
  const [tagPopover, setTagPopover] = useState<ITag>({
    xCoord: 0,
    yCoord: 0,
    title: "",
    originalImageWidth: 0,
    isEditMode: false,
  });
  const [tags, setTags] = useState<ITag[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);
  useOutsideClick({
    ref: imageRef,
    handler: () => {
      if (!popoverOpen) {
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
          isEditMode: false,
        }
      );
      return newTagsState;
    });
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
      isEditMode: false,
    });
  };

  const handleTagEdit = useCallback(
    (mode: "edit" | "delete", selectedTag: ITag) => {
      if (mode === "edit") {
        setTags((prev) => {
          const newTags = prev.map((tag) => {
            if (
              selectedTag.xCoord === tag.xCoord &&
              selectedTag.yCoord === tag.yCoord
            ) {
              tag = selectedTag;
            }
            return tag;
          });
          return [...newTags];
        });
      } else {
        setTags((prev) => {
          return prev.reduce((acc: ITag[], tag) => {
            if (
              selectedTag.xCoord !== tag.xCoord &&
              selectedTag.yCoord !== tag.yCoord
            ) {
              acc.push(tag);
            }
            return acc;
          }, []);
        });
      }
      formHook.setValue(`projectItems.${selectedItemIndex}.tags`, tags);
    },
    [formHook, selectedItemIndex, tags]
  );

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
            onEditTag={(selectedTag) => {
              handleTagEdit("edit", selectedTag);
              setPopoverOpen(false);
            }}
            onDeleteTag={(selectedTag) => {
              handleTagEdit("delete", selectedTag);
              setPopoverOpen(false);
            }}
          />
        )}
      </Box>
      <Flex
        p={[1, 1, 0]}
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
      >
        <Box>
          {formHook
            .getValues(`projectItems.${selectedItemIndex}.tags`)
            ?.map((tag) => {
              return (
                <Button
                  mr={2}
                  mt={2}
                  display="inline-block"
                  size="sm"
                  colorScheme="purple"
                  key={tag.xCoord + " " + tag.yCoord}
                  onClick={() => {
                    setPopoverOpen(true);
                    setTagPopover({ ...tag, isEditMode: true });
                  }}
                  maxWidth="150px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {tag.title}
                </Button>
              );
            })}
        </Box>
        <Box>
          <Button
            borderRadius="sm"
            mt={2}
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
