import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";
import { AddStoryItemCard } from "./AddStoryItemCard";
import { StoryItemModal } from "./StoryItemModal";

export const ProjectStory = observer(() => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [storyItems, setStoryItems] = useState([]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(storyItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result!.destination!.index!, 0, reorderedItem);
    setStoryItems(items);
  };
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Flex>
          <Droppable droppableId="stories" direction="horizontal">
            {(provided) => {
              return (
                <Flex {...provided.droppableProps} ref={provided.innerRef}>
                  {storyItems.map((item, index) => {
                    return (
                      <Draggable key={item} index={index} draggableId={item}>
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
                                <Box>
                                  <AiOutlinePlusCircle />
                                </Box>
                                Add Story {item}
                              </Flex>
                            </Box>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <AddStoryItemCard onClick={onOpen} />
                </Flex>
              );
            }}
          </Droppable>
        </Flex>
      </DragDropContext>
      <StoryItemModal isOpen={isOpen} onClose={onClose} />
    </>
  );
});
