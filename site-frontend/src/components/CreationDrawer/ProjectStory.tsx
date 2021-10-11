import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";

const test = ["1", "2", "3", "4"];
export const ProjectStory = observer(() => {
  const [stories, setStories] = useState(test);
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(stories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result!.destination!.index!, 0, reorderedItem);
    setStories(items);
  };
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Flex>
          <Droppable droppableId="stories" direction="horizontal">
            {(provided) => {
              return (
                <Flex {...provided.droppableProps} ref={provided.innerRef}>
                  {stories.map((item, index) => {
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
                  <Box height={"200px"} width={"200px"} border="1px solid grey">
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      height="100%"
                      flexDirection="column"
                    >
                      <Box>
                        <AiOutlinePlusCircle />
                      </Box>
                      Add Story
                    </Flex>
                  </Box>
                </Flex>
              );
            }}
          </Droppable>
        </Flex>
      </DragDropContext>
    </>
  );
});
