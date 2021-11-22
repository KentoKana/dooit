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
}: IMediaAreaImageContainerProps) => {
  return (
    <>
      <Popover
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
      >
        {currentTagPopoverState && (
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
                    onImageClick(tag);
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
                <Input
                  value={currentTagPopoverState?.title}
                  id="tagTitle"
                  placeholder="E.g. '3x2 Hardwood Board'..."
                  borderRadius="sm"
                  onChange={(e) => {
                    onTitleChange(e.target.value);
                  }}
                />
              }
            />
            <FormElement
              isInvalid={false}
              formLabel="URL (Optional)"
              formFor="url"
              formField={
                <Input
                  value={currentTagPopoverState?.url}
                  id="url"
                  placeholder="https://"
                  borderRadius="sm"
                  onChange={(e) => {
                    onUrlChange(e.target.value);
                  }}
                />
              }
            />
          </PopoverBody>
          <PopoverFooter d="flex" justifyContent="flex-end">
            <ButtonGroup size="sm">
              <Button borderRadius="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                borderRadius="sm"
                onClick={onAddTag}
              >
                Add Tag
              </Button>
            </ButtonGroup>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </>
  );
};
