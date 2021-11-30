import { Tag } from "@chakra-ui/tag";
import { ProjectFlairsDto } from "../Dtos/ProjectFlairsDto.dto";

interface IFlairTagProps {
  flair: ProjectFlairsDto;
  size?: string;
}
export const FlairTag = ({ flair, size }: IFlairTagProps) => {
  return (
    <Tag
      size={size ?? undefined}
      color={flair.isDarkText ? "grey.700" : "#fff"}
      variant="solid"
      background={flair.backgroundColor}
      cursor="pointer"
    >
      {flair.flairLabel}
    </Tag>
  );
};
