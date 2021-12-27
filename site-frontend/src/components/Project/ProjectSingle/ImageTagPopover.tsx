import { LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import { ImageTagsDto } from "../../../Dtos/project/ImageTagsDto.dto";
interface IImageTagPopoverProps {
  tag: ImageTagsDto;
  displayTags: boolean;
}
export const ImageTagPopover = ({
  tag,
  displayTags,
}: IImageTagPopoverProps) => {
  return (
    <Popover
      autoFocus={false}
      isOpen={displayTags}
      placement="bottom"
      closeOnBlur={false}
    >
      {displayTags && (
        <PopoverTrigger>
          <Box
            cursor="pointer"
            zIndex={3}
            position="absolute"
            height="20px"
            width="20px"
            borderRadius="50%"
            border="5px solid"
            borderColor="primary"
            top={tag?.yCoordinate}
            left={tag?.xCoordinate}
            background="#fff"
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
