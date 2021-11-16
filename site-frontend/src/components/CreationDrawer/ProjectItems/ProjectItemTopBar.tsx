import {
  AddIcon,
  DeleteIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Box, IconButton } from "@chakra-ui/react";

export interface IProjectItemTopBarProps {
  itemLength: number;
  onRemove: () => void;
  onAdd: () => void;
  disableMoveLeft: boolean;
  disableMoveRight: boolean;
  onMoveItemLeft: () => void;
  onMoveItemRight: () => void;
}
export const ProjectItemTopBar = ({
  itemLength,
  onRemove,
  onAdd,
  onMoveItemLeft,
  onMoveItemRight,
  disableMoveLeft,
  disableMoveRight,
}: IProjectItemTopBarProps) => {
  return (
    <Flex justifyContent="space-between" maxWidth={["150px", "150px", "180px"]}>
      <Box>
        <IconButton
          disabled={disableMoveLeft}
          onClick={() => {
            onMoveItemLeft();
          }}
          background="transparent"
          aria-label="Move Left"
          size="xs"
          icon={<TriangleUpIcon transform="rotate(-90deg)" />}
        />
        <IconButton
          disabled={disableMoveRight}
          onClick={() => {
            onMoveItemRight();
          }}
          background="transparent"
          aria-label="Move Right"
          size="xs"
          icon={<TriangleDownIcon transform="rotate(-90deg)" />}
        />
      </Box>
      <Box>
        <IconButton
          title="Remove item"
          mr={1}
          size="xs"
          background="transparent"
          backgroundColor="transparent"
          onClick={onRemove}
          aria-label="Remove Item"
          icon={<DeleteIcon />}
        />

        <IconButton
          display={["none", "none", "initial"]}
          title="Add item"
          size="xs"
          background="transparent"
          backgroundColor="transparent"
          onClick={onAdd}
          aria-label="Add Item"
          icon={<AddIcon />}
        />
      </Box>
    </Flex>
  );
};
