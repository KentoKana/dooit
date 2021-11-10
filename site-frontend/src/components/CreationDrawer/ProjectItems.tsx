import { Box, Flex, Image, IconButton, Button, Text } from "@chakra-ui/react";
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
import { useCallback, useState } from "react";
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
    const { control } = formHook;
    const { fields, move, remove, insert, swap } = useFieldArray({
      control,
      name: "projectItems",
    });

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
                                  setSelectedItemIndex(0);
                                  onItemSelect(0);
                                }}
                                onAdd={() => {
                                  insert(index + 1, {
                                    title: "",
                                    description: "",
                                  });
                                  setSelectedItemIndex(index + 1);
                                  onItemSelect(index + 1);
                                }}
                              />
                              <Flex
                                height="110px"
                                transition="0.2s ease all"
                                backgroundColor={
                                  selectedItemIndex === index
                                    ? "cyan.50"
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
                                        setSelectedItemIndex(index - 1);
                                        onItemSelect(index - 1);
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
                                        setSelectedItemIndex(index + 1);
                                        onItemSelect(index + 1);
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
                                      onItemSelect(index);
                                      setSelectedItemIndex(index);
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
                                      >
                                        <Box mr={3}>
                                          {mediaPreviewUrl && (
                                            <Image
                                              boxSize="80px"
                                              objectFit="cover"
                                              src={mediaPreviewUrl}
                                              alt=""
                                            />
                                          )}
                                        </Box>
                                        <Box>
                                          <Text fontWeight="normal">
                                            {(watchProjectItems[index] &&
                                              watchProjectItems[index]
                                                .description) ??
                                              ""}
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
                </Box>
              );
            }}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
);
