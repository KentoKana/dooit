import { Box, Flex, useDisclosure, Progress } from "@chakra-ui/react";
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
import { isNullOrUndefined } from "../../utils";

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
          <Flex>
            <Droppable droppableId="stories" direction="horizontal">
              {(provided) => {
                return (
                  <Flex {...provided.droppableProps} ref={provided.innerRef}>
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
                                </Flex>
                                {!isNullOrUndefined(item.progress) && (
                                  <Progress value={item.progress} />
                                )}
                              </Box>
                            );
                          }}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                    <AddItemCard onClick={onOpen} />
                  </Flex>
                );
              }}
            </Droppable>
          </Flex>
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
