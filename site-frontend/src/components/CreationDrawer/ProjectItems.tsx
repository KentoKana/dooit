import { Box, Flex, Input } from "@chakra-ui/react";
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
import { useEffect, useState } from "react";
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
  const { register, control, getValues, setValue } = formHook;
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
        <Droppable droppableId="stories">
          {(provided) => {
            return (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                <AddItemCard
                  onClick={() => {
                    append({
                      title: "",
                      description: "",
                      order: getValues("projectItems").length,
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
                              {mediaPreviewUrl && (
                                <img src={mediaPreviewUrl} alt="" />
                              )}
                              <Input
                                key={"imageAsFileList" + field.id}
                                onChange={(e) => {
                                  setValue(
                                    `projectItems.${index}.imageAsFileList`,
                                    e.target.files
                                  );
                                }}
                                type="file"
                              />
                              <Input
                                key={"description" + field.id}
                                type="text"
                                {...register(
                                  `projectItems.${index}.description`
                                )}
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
    </>
  );
});
