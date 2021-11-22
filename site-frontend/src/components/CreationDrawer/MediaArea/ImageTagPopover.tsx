import {
  Box,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  ButtonGroup,
  Input,
} from "@chakra-ui/react";
import "../styles.css";
import { FormElement } from "../../Forms/FormElement";
import { UseFormReturn } from "react-hook-form";
import { IProject } from "../index";
import { isNullOrUndefined } from "../../../utils";
import { ITag } from "./MediaAreaImageContainer";
import { DebounceInput } from "react-debounce-input";

interface IMediaAreaImageContainerProps {
  currentTagPopoverState?: ITag;
  formHook: UseFormReturn<IProject, object>;
  selectedItemIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onImageClick: (tag: ITag) => void;
  onTitleChange: (newTitle: string) => void;
  onUrlChange: (newUrl: string) => void;
  onAddTag: () => void;
  onEditTag: (selectedTag: ITag) => void;
  onDeleteTag: (selectedTag: ITag) => void;
}

export const ImageTagPopover = ({
  currentTagPopoverState,
  formHook,
  selectedItemIndex,
  isOpen,
  onClose,
  onImageClick,
  onTitleChange,
  onUrlChange,
  onAddTag,
  onEditTag,
  onDeleteTag,
}: IMediaAreaImageContainerProps) => {
  return (
    <>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
      >
        {isOpen && (
          <PopoverTrigger>
            <Box
              zIndex={3}
              position="absolute"
              height="20px"
              width="20px"
              borderRadius="50%"
              border="5px solid"
              borderColor="primary"
              top={currentTagPopoverState?.yCoord ?? 0}
              left={currentTagPopoverState?.xCoord ?? 0}
              background="#fff"
            ></Box>
          </PopoverTrigger>
        )}
        {formHook?.getValues(`projectItems.${selectedItemIndex}.tags`) &&
          formHook
            .getValues(`projectItems.${selectedItemIndex}.tags`)!
            .map((tag, index) => {
              return (
                <Box
                  onClick={() => {
                    onImageClick({
                      ...tag,
                      isEditMode: true,
                    });
                  }}
                  key={index}
                  zIndex={3}
                  position="absolute"
                  height="20px"
                  width="20px"
                  borderRadius="50%"
                  top={tag?.yCoord ?? 0}
                  left={tag?.xCoord ?? 0}
                  background="#fff"
                ></Box>
              );
            })}
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>
            <FormElement
              isRequired
              isInvalid={
                !isNullOrUndefined(formHook.formState!.errors?.projectItems)
              }
              formLabel="Title"
              formFor="tagTitle"
              formField={
                <DebounceInput
                  className="chakra-input css-k72x6j"
                  type="text"
                  value={currentTagPopoverState?.title ?? ""}
                  id="tagTitle"
                  placeholder="E.g. '3x2 Hardwood Board'..."
                  onChange={(e) => {
                    onTitleChange(e.target.value);
                  }}
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              }
            />
            <FormElement
              isInvalid={false}
              formLabel="URL (Optional)"
              formFor="url"
              formField={
                <DebounceInput
                  className="chakra-input css-k72x6j"
                  type="text"
                  value={currentTagPopoverState?.url ?? ""}
                  id="url"
                  placeholder="https://"
                  onChange={(e) => {
                    onUrlChange(e.target.value);
                  }}
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
              }
            />
            <Input type="hidden" borderRadius="sm" />
          </PopoverBody>
          <PopoverFooter d="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              <Button borderRadius="sm" onClick={onClose}>
                Cancel
              </Button>
              {currentTagPopoverState?.isEditMode ? (
                <>
                  <Button
                    colorScheme="red"
                    borderRadius="sm"
                    onClick={() => {
                      onDeleteTag(currentTagPopoverState);
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    colorScheme="primary"
                    borderRadius="sm"
                    onClick={() => {
                      onEditTag(currentTagPopoverState);
                    }}
                  >
                    Edit Tag
                  </Button>
                </>
              ) : (
                <Button
                  colorScheme="primary"
                  borderRadius="sm"
                  onClick={onAddTag}
                >
                  Add Tag
                </Button>
              )}
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
};
