import {
  Box,
  Flex,
  Image,
  IconButton,
  Button,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import {
  DragHandleIcon,
  EditIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { ProjectItemTopBar } from "./ProjectItemTopBar";
import { IProject } from ".";
import { useCallback, useEffect, useState } from "react";
import { truncateText } from "../../utils";
import { MobileMediaAreaDrawer } from "./MobileMediaAreaDrawer";
import { BreakPoints } from "../../enums/BreakPoints";
export interface IProjectItem {
  title: string;
  description: string;
  mediaUrl?: string;
  alt?: string;
  mediaAsFile?: File;
  order: number;
  progress?: number;
}

interface IProjectItemProps {
  onItemSelect: (selectedItemIndex: number) => void;
  formHook: UseFormReturn<IProject, object>;
}

export const ProjectItems = observer(
  ({ formHook, onItemSelect }: IProjectItemProps) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [itemSelected, setItemSelected] = useState(false);
    const { control } = formHook;
    const { fields, move, remove, insert, swap } = useFieldArray({
      control,
      name: "projectItems",
    });
    const mobileMediaAreaDisclosure = useDisclosure();
    const [displayMobileMediaAreaDrawer] = useMediaQuery(BreakPoints.Mobile);
    const watchProjectItems = useWatch({
      name: "projectItems",
      control,
    });
    const handleOnDragEnd = useCallback(
      (result: DropResult) => {
        if (!result.destination) return;
        setSelectedItemIndex(result.destination.index);
        onItemSelect(result.destination.index);
        move(result.source.index, result.destination.index);
      },
      [onItemSelect, move]
    );
    const handleItemSelect = (index: number) => {
      setSelectedItemIndex(index);
      onItemSelect(index);
      setItemSelected(true);
    };

    useEffect(() => {
      if (itemSelected) {
        setTimeout(() => {
          document.getElementById("mediabox")?.focus();
          setItemSelected(false);
        }, 500);
      }
    }, [itemSelected]);

    return (
      <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => {
              return (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((field, index) => {
                    let mediaPreviewUrl: string | undefined = undefined;
                    if (
                      watchProjectItems &&
                      watchProjectItems[index] &&
                      watchProjectItems[index].mediaUrl
                    ) {
                      mediaPreviewUrl = URL.createObjectURL(
                        watchProjectItems[index].mediaAsFile
                      );
                    }

                    return (
                      <Draggable
                        key={`projectItem-${field.id}`}
                        index={index}
                        draggableId={`item-${field.id}`}
                      >
                        {(provided) => {
                          return (
                            <Flex
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              minHeight={"100px"}
                              width={"100%"}
                              my={3}
                              direction="column"
                            >
                              <ProjectItemTopBar
                                itemLength={watchProjectItems.length}
                                onRemove={() => {
                                  if (watchProjectItems.length === 1) {
                                    remove(index);
                                    insert(index, {
                                      title: "",
                                      description: "",
                                    });
                                  } else {
                                    remove(index);
                                  }
                                  handleItemSelect(0);
                                }}
                                onAdd={() => {
                                  insert(index + 1, {
                                    title: "",
                                    description: "",
                                  });
                                  handleItemSelect(index + 1);
                                }}
                              />
                              <Flex
                                color="grey.700"
                                height="110px"
                                transition="0.2s ease all"
                                borderRadius="sm"
                                backgroundColor={
                                  selectedItemIndex === index
                                    ? "cyan.100"
                                    : "grey.50"
                                }
                              >
                                <Box w="10%">
                                  <Flex
                                    w="10%"
                                    height="110px"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    px={3}
                                    borderLeft="4px solid"
                                    borderColor={
                                      selectedItemIndex === index
                                        ? "primary"
                                        : "grey.100"
                                    }
                                    direction="column"
                                  >
                                    <IconButton
                                      disabled={index === 0}
                                      onClick={() => {
                                        swap(index, index - 1);
                                        handleItemSelect(index - 1);
                                      }}
                                      background="transparent"
                                      aria-label="Move Up"
                                      size="xs"
                                      icon={<TriangleUpIcon />}
                                    />
                                    <DragHandleIcon title="Drag item" />
                                    <IconButton
                                      title="Move up"
                                      disabled={
                                        index === watchProjectItems.length - 1
                                      }
                                      onClick={() => {
                                        swap(index, index + 1);
                                        handleItemSelect(index + 1);
                                      }}
                                      background="transparent"
                                      aria-label="Move Down"
                                      size="xs"
                                      icon={<TriangleDownIcon />}
                                    />
                                  </Flex>
                                </Box>
                                <Box width="90%" pl={2}>
                                  <Button
                                    title="Edit this item"
                                    _focus={{
                                      outline: "none",
                                    }}
                                    background="transparent"
                                    aria-label="Edit this item"
                                    height="100%"
                                    width="100%"
                                    variant="unstyled"
                                    onClick={() => {
                                      if (displayMobileMediaAreaDrawer) {
                                        mobileMediaAreaDisclosure.onOpen();
                                      }
                                      handleItemSelect(index);
                                    }}
                                  >
                                    {mediaPreviewUrl ||
                                    (watchProjectItems[index] &&
                                      watchProjectItems[index].description) ? (
                                      <Flex
                                        justifyContent="between"
                                        alignItems="center"
                                        height="100%"
                                        width="100%"
                                        maxHeight="100px"
                                        overflowY="auto"
                                      >
                                        <Box mr={3}>
                                          {mediaPreviewUrl && (
                                            <Image
                                              borderRadius="sm"
                                              boxSize="80px"
                                              objectFit="cover"
                                              src={mediaPreviewUrl}
                                              alt=""
                                            />
                                          )}
                                        </Box>
                                        <Box>
                                          <Text
                                            fontSize="sm"
                                            maxWidth={
                                              mediaPreviewUrl ? "150px" : "100%"
                                            }
                                            textAlign="left"
                                            fontWeight="normal"
                                            whiteSpace="break-spaces"
                                            overflowX="hidden"
                                            overflowY="auto"
                                          >
                                            {watchProjectItems[index] &&
                                            watchProjectItems[index].description
                                              ? truncateText(
                                                  watchProjectItems[index]
                                                    .description,
                                                  mediaPreviewUrl ? 60 : 100
                                                )
                                              : ""}
                                          </Text>
                                        </Box>
                                      </Flex>
                                    ) : (
                                      <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                      >
                                        <EditIcon mr={3} /> Edit this item
                                      </Flex>
                                    )}
                                  </Button>
                                </Box>
                              </Flex>
                            </Flex>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <MobileMediaAreaDrawer
                    onClose={() => {
                      mobileMediaAreaDisclosure.onClose();
                    }}
                    isOpen={mobileMediaAreaDisclosure.isOpen}
                    formHook={formHook}
                    selectedItemIndex={selectedItemIndex}
                  />
                </Box>
              );
            }}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
);
