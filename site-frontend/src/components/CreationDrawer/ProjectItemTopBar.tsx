import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/react";

export interface IProjectItemTopBarProps {
  itemLength: number;
  onRemove: () => void;
  onAdd: () => void;
}
export const ProjectItemTopBar = ({
  itemLength,
  onRemove,
  onAdd,
}: IProjectItemTopBarProps) => {
  return (
    <Flex justifyContent="flex-end">
      <IconButton
        title="Remove item"
        // disabled={itemLength === 1}
        mr={1}
        size="xs"
        background="transparent"
        backgroundColor="transparent"
        onClick={onRemove}
        aria-label="Remove Item"
        icon={<DeleteIcon />}
      />

      <IconButton
        title="Add item"
        size="xs"
        background="transparent"
        backgroundColor="transparent"
        onClick={onAdd}
        aria-label="Add Item"
        icon={<AddIcon />}
      />
    </Flex>
  );
};
