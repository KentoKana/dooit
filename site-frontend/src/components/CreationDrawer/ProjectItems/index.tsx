import { Box, Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { IProject } from "../";
import { useCallback, useEffect, useState } from "react";
import { MobileMediaAreaDrawer } from "../MediaArea/MobileMediaAreaDrawer";
import { BreakPoints } from "../../../enums/BreakPoints";
import { ItemRemovalConfirmationModal } from "./ItemRemovalConfirmationModal";
import { AddItemButton } from "./AddItemButton";
import { ProjectItemCard } from "./ProjectItemCard";
import { ITag } from "../MediaArea/MediaAreaImageContainer";
export interface IProjectItem {
  title: string;
  description: string;
  mediaUrl?: string;
  alt?: string;
  mediaAsFile?: File;
  order: number;
  progress?: number;
  tags?: ITag[];
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
    const [isDragging, setIsDragging] = useState(false);
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
        setIsDragging(false);
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
        <DragDropContext
          onDragEnd={handleOnDragEnd}
          onDragStart={() => {
            setIsDragging(true);
          }}
        >
          <Droppable droppableId="projects" direction={"horizontal"}>
            {(provided) => {
              return (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  flexDirection={"row"}
                  flexShrink={0}
                >
                  {fields.map((field, index) => {
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
                              minHeight={["150px", "150px", "180px"]}
                              maxWidth={["150px", "150px", "180px"]}
                              my={3}
                              direction="column"
                              mx={2}
                            >
                              <ProjectItemCard
                                projectItemsState={watchProjectItems}
                                selectedItemIndex={selectedItemIndex}
                                currentItemIndex={index}
                                onProjectItemAction={{
                                  onAddItem: () => {
                                    insert(index + 1, {
                                      title: "",
                                      description: "",
                                    });
                                    handleItemSelect(index + 1);
                                    if (displayMobileMediaAreaDrawer) {
                                      mobileMediaAreaDisclosure.onOpen();
                                    }
                                  },
                                  onRemoveItem: () => {
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
                                  },
                                  onMoveItemLeft: () => {
                                    swap(index, index - 1);
                                    handleItemSelect(index - 1);
                                  },
                                  onMoveItemRight: () => {
                                    swap(index, index + 1);
                                    handleItemSelect(index + 1);
                                  },
                                  onItemSelect: () => {
                                    if (displayMobileMediaAreaDrawer) {
                                      mobileMediaAreaDisclosure.onOpen();
                                    }
                                    handleItemSelect(index);
                                  },
                                }}
                              />
                            </Flex>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {!isDragging && (
                    <AddItemButton
                      onClick={() => {
                        insert(watchProjectItems.length, {
                          title: "",
                          description: "",
                        });
                        handleItemSelect(watchProjectItems.length);
                        if (displayMobileMediaAreaDrawer) {
                          mobileMediaAreaDisclosure.onOpen();
                        }
                      }}
                    />
                  )}
                  {provided.placeholder}
                  <MobileMediaAreaDrawer
                    onClose={() => {
                      mobileMediaAreaDisclosure.onClose();
                    }}
                    isOpen={mobileMediaAreaDisclosure.isOpen}
                    formHook={formHook}
                    selectedItemIndex={selectedItemIndex}
                  />
                  <ItemRemovalConfirmationModal
                    onCancel={deleteConfirmationDisclosure.onClose}
                    onRemoveConfirm={() => {
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
                    isOpen={deleteConfirmationDisclosure.isOpen}
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
