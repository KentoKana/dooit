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
  Text,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import "../styles.css";
import { FormElement } from "../../Forms/FormElement";
import { UseFormReturn } from "react-hook-form";
import { IProject } from "../index";
import { ITag } from "./MediaAreaImageContainer";
import { DebounceInput } from "react-debounce-input";
import { useRef, useEffect } from "react";
import { useWindowSize } from "../../../hooks/useWindowSize";

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
  imageRef: React.RefObject<HTMLImageElement>;
  readonly?: boolean;
}

export const ImageTagPopover = ({
  imageRef,
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
  readonly,
}: IMediaAreaImageContainerProps) => {
  const [width, height] = useWindowSize();
  // Close popover if selected item changes.
  const selectedItemIndexRef = useRef(selectedItemIndex);
  useEffect(() => {
    if (selectedItemIndexRef.current !== selectedItemIndex) {
      selectedItemIndexRef.current = selectedItemIndex;
      onClose();
    }
  }, [width, height, selectedItemIndex, onClose]);
  const tags = formHook.getValues(`projectItems.${selectedItemIndex}.tags`);
  const currentTagScaleFactor =
    (imageRef.current?.offsetWidth ?? 0) /
    (currentTagPopoverState?.originalImageSize ?? 1);

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
              height="30px"
              width="30px"
              borderRadius="50%"
              border="5px solid"
              borderColor="primary"
              top={currentTagPopoverState!.yCoord * currentTagScaleFactor}
              left={currentTagPopoverState!.xCoord * currentTagScaleFactor}
              background="#fff"
            ></Box>
          </PopoverTrigger>
        )}
        {tags?.map((tag, index) => {
          const scaleFactor =
            (imageRef.current?.offsetWidth ?? 0) / (tag.originalImageSize ?? 1);
          return (
            <Box
              onClick={() => {
                onImageClick({
                  ...tag,
                  isEditMode: true,
                });
              }}
              cursor="pointer"
              key={index}
              zIndex={3}
              position="absolute"
              height="30px"
              width="30px"
              borderRadius="50%"
              border="5px solid"
              borderColor="primary"
              top={tag?.yCoord * scaleFactor}
              left={tag?.xCoord * scaleFactor}
              background="#fff"
            ></Box>
          );
        })}
        <PopoverContent width="100%" maxWidth={readonly ? "200px" : undefined}>
          <PopoverArrow />
          <PopoverBody>
            {readonly ? (
              <Box>
                {currentTagPopoverState?.url ? (
                  <a
                    href={currentTagPopoverState?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkIcon mr={3} />
                    {currentTagPopoverState?.title}
                  </a>
                ) : (
                  <Text textAlign="center">
                    {currentTagPopoverState?.title}
                  </Text>
                )}
              </Box>
            ) : (
              <>
                <FormElement
                  isRequired
                  isInvalid={false}
                  formLabel="Title"
                  formFor="tagTitle"
                  maxLengthDisplay={{
                    maxLength: 200,
                    currentLengthCount:
                      currentTagPopoverState?.title.length ?? 0,
                  }}
                  formField={
                    <DebounceInput
                      maxLength={200}
                      required
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
                  isInvalid={
                    currentTagPopoverState?.url &&
                    !new RegExp(
                      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
                    ).test(currentTagPopoverState?.url ?? "")
                      ? true
                      : false
                  }
                  errorMessage="Please enter a valid URL. (E.g. https://ForkIt.today)"
                  formLabel="URL"
                  formFor="url"
                  formField={
                    <DebounceInput
                      className="chakra-input css-k72x6j"
                      type="text"
                      value={currentTagPopoverState?.url ?? ""}
                      id="url"
                      placeholder="http://"
                      onChange={(e) => {
                        onUrlChange(e.target.value);
                      }}
                      onKeyPress={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter") e.preventDefault();
                      }}
                    />
                  }
                />
              </>
            )}
            <Input type="hidden" borderRadius="sm" />
          </PopoverBody>
          {!readonly && (
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
                      disabled={!currentTagPopoverState?.title}
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
                    disabled={!currentTagPopoverState?.title}
                    colorScheme="primary"
                    borderRadius="sm"
                    onClick={onAddTag}
                  >
                    Add Tag
                  </Button>
                )}
              </ButtonGroup>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};
