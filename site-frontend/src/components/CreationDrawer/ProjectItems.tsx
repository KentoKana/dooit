import {
  Box,
  Flex,
  Input,
  Image,
  IconButton,
  FormLabel,
  Button,
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
import {
  DragHandleIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { ProjectItemTopBar } from "./ProjectItemTopBar";
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
  const { fields, append, move, remove, insert, swap } = useFieldArray({
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
                            my={6}
                          >
                            <Flex
                              title="Move down"
                              justifyContent="space-between"
                              alignItems="center"
                              px={3}
                              borderLeft="4px solid"
                              borderColor="primary"
                              direction="column"
                            >
                              <IconButton
                                disabled={index === 0}
                                onClick={() => {
                                  swap(index, index - 1);
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
                                }}
                                background="transparent"
                                aria-label="Move Down"
                                size="xs"
                                icon={<TriangleDownIcon />}
                              />
                            </Flex>
                            <Box width="100%">
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
                                }}
                                onAdd={() => {
                                  insert(index + 1, {
                                    title: "",
                                    description: "",
                                  });
                                }}
                              />
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
                                    <FormLabel htmlFor={`media-${index}`}>
                                      {mediaPreviewUrl ? (
                                        <Image
                                          boxSize="50px"
                                          objectFit="cover"
                                          src={mediaPreviewUrl}
                                          alt=""
                                        />
                                      ) : (
                                        <>Upload Image</>
                                      )}
                                      <Input
                                        hidden
                                        id={`media-${index}`}
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
                                    </FormLabel>
                                  </Box>
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
