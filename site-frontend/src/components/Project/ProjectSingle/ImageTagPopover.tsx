import { LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef } from "react";
import { ImageTagsDto } from "../../../Dtos/project/ImageTagsDto.dto";
interface IImageTagPopoverProps {
  tag: ImageTagsDto;
  displayTags: boolean;
  selectedTag?: number;
  onSelectedTagChange: (tagId?: number) => void;
}
export const ImageTagPopover = ({
  tag,
  displayTags,
  selectedTag,
  onSelectedTagChange,
}: IImageTagPopoverProps) => {
  const tagRef = useRef(null);
  useOutsideClick({
    ref: tagRef,
    handler: () => {
      onSelectedTagChange(undefined);
    },
  });
  return (
    <Popover
      autoFocus={false}
      isOpen={selectedTag === tag.id && displayTags}
      placement="bottom"
      closeOnBlur={false}
    >
      {displayTags && (
        <PopoverTrigger>
          <Box
            ref={tagRef}
            cursor="pointer"
            zIndex={3}
            position="absolute"
            height="30px"
            width="30px"
            borderRadius="50%"
            border="5px solid"
            borderColor="primary"
            top={tag?.yCoordinate}
            left={tag?.xCoordinate}
            background="#fff"
            onClick={() => onSelectedTagChange(tag.id)}
          ></Box>
        </PopoverTrigger>
      )}
      <PopoverContent width="100%" maxWidth={"200px"}>
        <PopoverArrow />
        <PopoverBody fontSize="sm">
          <Box>
            {tag?.url ? (
              <a href={tag?.url} target="_blank" rel="noreferrer">
                <LinkIcon mr={3} />
                {tag?.title}
              </a>
            ) : (
              <Text textAlign="center">{tag?.title}</Text>
            )}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
