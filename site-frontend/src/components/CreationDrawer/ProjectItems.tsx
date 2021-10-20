import {
  Box,
  Button,
  Flex,
  Input,
  Image,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { AddItemCard } from "./AddItemCard";
import {
  FieldValues,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { DeleteIcon, DragHandleIcon } from "@chakra-ui/icons";
export interface IProjectItem {
  title: string;
  description: string;
  imageUrl?: string;
  alt?: string;
  imageAsFile?: File;
  imageAsFileList?: FileList;
  order: number;
  progress?: number;
}

interface IProjectItemProps {
  formHook: UseFormReturn<FieldValues, object>;
}

export const ProjectItems = observer(({ formHook }: IProjectItemProps) => {
  const { register, control, setValue } = formHook;
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "projectItems",
  });
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const watchProjectItems = useWatch({ name: "projectItems", control });

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => {
            return (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <AddItemCard
                  onClick={() => {
                    append({
                      title: "",
                      description: "",
                    });
                  }}
                />
                {fields.map((field, index) => {
                  let mediaPreviewUrl: string | null = null;
                  if (
                    watchProjectItems &&
                    watchProjectItems[index] &&
                    watchProjectItems[index].imageAsFileList &&
                    watchProjectItems[index].imageAsFileList[0]
                  ) {
                    mediaPreviewUrl = URL.createObjectURL(
                      watchProjectItems[index].imageAsFileList[0]
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
                            my={4}
                          >
                            <Flex
                              alignItems="center"
                              px={3}
                              borderLeft="4px solid"
                              borderColor="primary"
                            >
                              <DragHandleIcon />
                            </Flex>
                            <Box>
                              <Flex justifyContent="flex-end">
                                <IconButton
                                  size="xs"
                                  background="transparent"
                                  backgroundColor="transparent"
                                  onClick={() => {
                                    remove(index);
                                  }}
                                  aria-label="Remove"
                                  icon={<DeleteIcon />}
                                />
                              </Flex>
                              <Input
                                value={index}
                                key={"order" + field.id}
                                {...register(`projectItems.${index}.order`)}
                                type="hidden"
                              />
                              <Flex
                                justifyContent="center"
                                alignItems="center"
                                height="100%"
                              >
                                <Flex>
                                  <Box>
                                    {mediaPreviewUrl && (
                                      <Image
                                        boxSize="50px"
                                        objectFit="cover"
                                        src={mediaPreviewUrl}
                                        alt=""
                                      />
                                    )}
                                    <Input
                                      p={0}
                                      key={"imageAsFileList" + field.id}
                                      onChange={(e) => {
                                        setValue(
                                          `projectItems.${index}.imageAsFileList`,
                                          e.target.files
                                        );
                                      }}
                                      type="file"
                                    />
                                  </Box>
                                  {/* <Input
                                  key={"description" + field.id}
                                  type="text"
                                  {...register(
                                    `projectItems.${index}.description`
                                  )}
                                /> */}
                                </Flex>
                              </Flex>
                            </Box>
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
});
