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
        disabled={itemLength === 1}
        mr={1}
        size="xs"
        background="transparent"
        backgroundColor="transparent"
        onClick={onRemove}
        aria-label="Remove"
        icon={<DeleteIcon />}
      />

      <IconButton
        size="xs"
        background="transparent"
        backgroundColor="transparent"
        onClick={onAdd}
        aria-label="Remove"
        icon={<AddIcon />}
      />
    </Flex>
  );
};
