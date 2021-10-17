import { Box, Flex, Input, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { AddItemCard } from "./AddItemCard";
import { ItemModal } from "./ItemModal";
import { IProject } from ".";
import Compressor from "compressorjs";

interface IProjectItemProps {
  projectState: IProject;
  onChange: (newProjectState: IProject) => void;
}

export const ProjectItems = observer(
  ({ onChange, projectState }: IProjectItemProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleOnDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const items = Array.from(projectState.projectItems);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result!.destination!.index!, 0, reorderedItem);
      onChange({
        ...projectState,
        projectItems: items.map((item, index) => {
          item.order = index;
          return {
            ...item,
          };
        }),
      });
    };

    return (
      <>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="stories">
            {(provided) => {
              return (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  <AddItemCard
                    onClick={() => {
                      onChange({
                        ...projectState,
                        projectItems: [
                          ...projectState.projectItems,
                          {
                            title: "",
                            description: "",
                            order: projectState.projectItems.length,
                          },
                        ],
                      });
                    }}
                  />
                  {projectState.projectItems.map((item, index) => {
                    return (
                      <Draggable
                        key={item.title + index}
                        index={index}
                        draggableId={item.title + index}
                      >
                        {(provided) => {
                          return (
                            <Box
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              height={"200px"}
                              width={"200px"}
                              border="1px solid grey"
                            >
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                height="100%"
                                flexDirection="column"
                              >
                                {item.title}
                                <img src={item.imageUrl} alt="" />
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const newItemsState =
                                      projectState.projectItems.map(
                                        (currentItem, i) => {
                                          if (i === index) {
                                            currentItem.image =
                                              e.target.files![0];
                                            currentItem.imageUrl =
                                              URL.createObjectURL(
                                                e.target.files![0]
                                              );
                                          }
                                          return currentItem;
                                        }
                                      );
                                    onChange({
                                      ...projectState,
                                      projectItems: newItemsState,
                                    });
                                  }}
                                />
                                <Input
                                  type="text"
                                  value={
                                    projectState.projectItems[index].description
                                  }
                                  onChange={(e) => {
                                    const newItemsState =
                                      projectState.projectItems.map(
                                        (currentItem, i) => {
                                          if (i === index) {
                                            currentItem.description =
                                              e.target.value;
                                          }
                                          return currentItem;
                                        }
                                      );
                                    onChange({
                                      ...projectState,
                                      projectItems: newItemsState,
                                    });
                                  }}
                                />
                              </Flex>
                            </Box>
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
        <ItemModal
          isOpen={isOpen}
          onClose={onClose}
          onItemCreate={(newItem) => {
            onChange({
              ...projectState,
              projectItems: [
                ...projectState.projectItems,
                {
                  ...newItem,
                  order: projectState.projectItems.length,
                },
              ],
            });
          }}
        />
      </>
    );
  }
);
