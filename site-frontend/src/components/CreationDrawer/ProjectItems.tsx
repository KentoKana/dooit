import {
  Box,
  Flex,
  Image,
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
import { DragHandleIcon } from "@chakra-ui/icons";
import { ProjectItemTopBar } from "./ProjectItemTopBar";
import { IProject } from ".";
import { useCallback, useEffect, useState } from "react";
import { truncateText } from "../../utils";
import { MobileMediaAreaDrawer } from "./MobileMediaAreaDrawer";
import { BreakPoints } from "../../enums/BreakPoints";
import { ModalTemplate } from "../ModalTemplate";
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
    const deleteConfirmationDisclosure = useDisclosure();
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
          <Droppable droppableId="projects" direction={"horizontal"}>
            {(provided) => {
              return (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  display="flex"
                  justifyContent="flex-start"
                  flexDirection={"row"}
                >
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
                              maxWidth={"150px"}
                              my={3}
                              direction="column"
                              mx={2}
                            >
                              <ProjectItemTopBar
                                disableMoveLeft={index === 0}
                                disableMoveRight={
                                  index === watchProjectItems.length - 1
                                }
                                onMoveItemLeft={() => {
                                  swap(index, index - 1);
                                  handleItemSelect(index - 1);
                                }}
                                onMoveItemRight={() => {
                                  swap(index, index + 1);
                                  handleItemSelect(index + 1);
                                }}
                                itemLength={watchProjectItems.length}
                                onRemove={() => {
                                  if (
                                    !watchProjectItems[index].mediaAsFile &&
                                    !watchProjectItems[index].mediaUrl &&
                                    !watchProjectItems[index].description
                                  ) {
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
                                  } else {
                                    handleItemSelect(index);
                                    deleteConfirmationDisclosure.onOpen();
                                  }
                                }}
                                onAdd={() => {
                                  insert(index + 1, {
                                    title: "",
                                    description: "",
                                  });
                                  handleItemSelect(index + 1);
                                  if (displayMobileMediaAreaDrawer) {
                                    mobileMediaAreaDisclosure.onOpen();
                                  }
                                }}
                              />
                              <Flex
                                color="grey.700"
                                width={"150px"}
                                height={"150px"}
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
                                    height="100%"
                                    justifyContent="center"
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
                                    <DragHandleIcon title="Drag item" />
                                  </Flex>
                                </Box>
                                <Box width="90%">
                                  <Box
                                    _focus={{
                                      outline: "none",
                                    }}
                                    background="transparent"
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
                                        py="10px"
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                        width="100%"
                                        overflowY="auto"
                                        direction="column"
                                      >
                                        <Box>
                                          {mediaPreviewUrl && (
                                            <Image
                                              borderRadius="sm"
                                              boxSize="100px"
                                              objectFit="cover"
                                              src={mediaPreviewUrl}
                                              alt=""
                                            />
                                          )}
                                          {watchProjectItems[index] &&
                                            watchProjectItems[index]
                                              .description &&
                                            !mediaPreviewUrl && (
                                              <Text
                                                fontSize="sm"
                                                maxWidth={"100px"}
                                                textAlign="left"
                                                fontWeight="normal"
                                                whiteSpace="break-spaces"
                                                overflowX="hidden"
                                                overflowY="auto"
                                              >
                                                {watchProjectItems[index] &&
                                                watchProjectItems[index]
                                                  .description
                                                  ? truncateText(
                                                      watchProjectItems[index]
                                                        .description,
                                                      mediaPreviewUrl ? 60 : 100
                                                    )
                                                  : ""}
                                              </Text>
                                            )}
                                        </Box>
                                        {/* <Box></Box> */}
                                      </Flex>
                                    ) : (
                                      <Flex
                                        justifyContent="center"
                                        alignItems="center"
                                        height="100%"
                                      >
                                        Empty
                                      </Flex>
                                    )}
                                  </Box>
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
                  <ModalTemplate
                    size="md"
                    heading="Are you sure you want to delete this item?"
                    isOpen={deleteConfirmationDisclosure.isOpen}
                    footer={
                      <Flex justifyContent="space-between" w="100%">
                        <Button
                          variant="outline"
                          borderRadius="sm"
                          mr="2"
                          onClick={deleteConfirmationDisclosure.onClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          borderRadius="sm"
                          onClick={() => {
                            if (watchProjectItems.length === 1) {
                              remove(selectedItemIndex);
                              insert(selectedItemIndex, {
                                title: "",
                                description: "",
                              });
                            } else {
                              remove(selectedItemIndex);
                            }
                            handleItemSelect(0);
                            deleteConfirmationDisclosure.onClose();
                          }}
                        >
                          Yes, Remove it
                        </Button>
                      </Flex>
                    }
                  ></ModalTemplate>
                </Box>
              );
            }}
          </Droppable>
        </DragDropContext>
      </>
    );
  }
);
