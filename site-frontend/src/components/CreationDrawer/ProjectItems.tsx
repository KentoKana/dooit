import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useEffect, useRef, useState } from "react";
import { AddItemCard } from "./AddItemCard";
import { IProjectItem, ItemModal } from "./ItemModal";

interface IProjectItemProps {
  onChange: (newItemsState: IProjectItem[]) => void;
}

export const ProjectItems = observer(({ onChange }: IProjectItemProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [projectItems, setProjectItems] = useState<IProjectItem[]>([]);
  const projectItemsRef = useRef(projectItems);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(projectItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result!.destination!.index!, 0, reorderedItem);
    setProjectItems(items);
  };

  useEffect(() => {
    // Check if project item length changed from previous render
    if (projectItemsRef.current.length !== projectItems.length) {
      onChange(projectItems);
      projectItemsRef.current.length = projectItems.length;
    }
  }, [projectItems, onChange]);
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Flex>
          <Droppable droppableId="stories" direction="horizontal">
            {(provided) => {
              return (
                <Flex {...provided.droppableProps} ref={provided.innerRef}>
                  {projectItems.map((item, index) => {
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
          setProjectItems((prev) => {
            return [...prev, newItem];
          });
        }}
      />
    </>
  );
});
