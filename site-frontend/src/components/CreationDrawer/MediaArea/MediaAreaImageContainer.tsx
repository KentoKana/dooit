import {
  Box,
  Button,
  Image,
  useOutsideClick,
  Flex,
  Text,
  IconButton,
} from "@chakra-ui/react";
import "../styles.css";
import { useState } from "react";
import { AiFillTag } from "react-icons/ai";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { IProject } from "../index";
import { ImageTagPopover } from "./ImageTagPopover";
import { CloseIcon } from "@chakra-ui/icons";

interface IMediaAreaImageContainerProps {
  mediaUrl: string;
  imageRef: React.RefObject<HTMLImageElement>;
  formHook: UseFormReturn<IProject, object>;
  selectedItemIndex: number;
}

export interface ITag {
  id?: number;
  xCoord: number;
  yCoord: number;
  title: string;
  url?: string;
  isEditMode: boolean;
  originalImageSize: number;
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
    isEditMode: false,
    originalImageSize: 0,
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);
  const { append } = useFieldArray({
    control: formHook.control,
    name: `projectItems.${selectedItemIndex}.tags`,
  });

  useOutsideClick({
    ref: imageRef,
    handler: () => {
      if (!popoverOpen) {
        setPopoverOpen(false);
      }
    },
  });
  const handleAddTag = () => {
    const tags = formHook.getValues(`projectItems.${selectedItemIndex}.tags`);
    if (tags) {
      append({
        xCoord: tagPopover!.xCoord!,
        yCoord: tagPopover!.yCoord!,
        title: tagPopover?.title!,
        url: tagPopover?.url,
        isEditMode: false,
      });
      formHook.setValue(`projectItems.${selectedItemIndex}.tags`, [
        ...tags,
        {
          xCoord: tagPopover!.xCoord!,
          yCoord: tagPopover!.yCoord!,
          title: tagPopover?.title!,
          url: tagPopover?.url,
          isEditMode: false,
          originalImageSize: imageRef?.current?.offsetWidth ?? 0,
        },
      ]);
    } else {
      formHook.setValue(`projectItems.${selectedItemIndex}.tags`, [
        {
          xCoord: tagPopover!.xCoord!,
          yCoord: tagPopover!.yCoord!,
          title: tagPopover?.title!,
          url: tagPopover?.url,
          isEditMode: false,
          originalImageSize: imageRef?.current?.offsetWidth ?? 0,
        },
      ]);
    }
    setPopoverOpen(false);
  };

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setPopoverOpen(true);
    const rect = imageRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect!.left - 10;
    const y = e.clientY - rect!.top - 10;
    setTagPopover({
      xCoord: x,
      yCoord: y,
      title: "",
      url: "",
      isEditMode: false,
      originalImageSize: imageRef?.current?.offsetWidth ?? 0,
    });
  };

  const handleTagEdit = (mode: "edit" | "delete", selectedTag: ITag) => {
    const tags = formHook.getValues(`projectItems.${selectedItemIndex}.tags`);
    if (mode === "edit") {
      const updatedTags = tags?.map((tag) => {
        if (
          selectedTag.xCoord === tag.xCoord &&
          selectedTag.yCoord === tag.yCoord
        ) {
          tag = selectedTag;
        }
        return tag;
      });
      formHook.setValue(`projectItems.${selectedItemIndex}.tags`, updatedTags);
    } else {
      const updatedTags = tags?.reduce((acc: ITag[], tag) => {
        if (
          selectedTag.xCoord !== tag.xCoord &&
          selectedTag.yCoord !== tag.yCoord
        ) {
          acc.push(tag);
        }
        return acc;
      }, []);
      formHook.setValue(`projectItems.${selectedItemIndex}.tags`, updatedTags);
    }
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
        <ImageTagPopover
          readonly={!isTagMode}
          imageRef={imageRef}
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
            ?.map((tag, id) => {
              return (
                <Box
                  key={id}
                  display="inline-flex"
                  alignItems="center"
                  mr={2}
                  mt={2}
                >
                  <Button
                    title={isTagMode ? "Edit tag" : "View tag"}
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                    display="inline-block"
                    size="sm"
                    colorScheme="purple"
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
                  <IconButton
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                    colorScheme="purple"
                    size="sm"
                    icon={<CloseIcon fontSize="10px" />}
                    aria-label="Remove tag"
                    title="Remove tag"
                    onClick={() => {
                      handleTagEdit("delete", tag);
                      setPopoverOpen(false);
                    }}
                  />
                </Box>
              );
            })}
        </Box>
        <Box>
          <Button
            borderRadius="sm"
            mt={2}
            size="sm"
            colorScheme={isTagMode ? "blue" : "yellow"}
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
                Add/Edit Tags
              </Text>
            )}
          </Button>
        </Box>
      </Flex>
    </>
  );
};
