import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import { Wizard } from "react-use-wizard";
import { ProjectCreateOptionsDto } from "../../../Dtos/project/ProjectCreateOptionsDto.dto";
import { IngredientsStep } from "./IngredientsStep";
import { RecipeInstructions } from "./RecipeInstructionsStep";
import { RecipeNameStep } from "./RecipeNameStep";
interface ISidebarProps {
  onItemSelect: (itemIndex: number) => void;
  projectCreationOptions: ProjectCreateOptionsDto;
}

export const Sidebar = ({
  onItemSelect,
  projectCreationOptions,
}: ISidebarProps) => {
  return (
    <Box>
      <Flex justifyContent="center">
        <Box width="100%" maxW="800px">
          <Wizard>
            <RecipeNameStep projectCreationOptions={projectCreationOptions} />
            <IngredientsStep />
            <RecipeInstructions
              onItemSelect={(selected) => {
                onItemSelect(selected);
              }}
            />
            {/* Unused Input components...but used for the sake of being able to apply chakra styles on non-chakra components */}
            <Input
              maxLength={150}
              color="grey.700"
              background="#fff"
              borderRadius="sm"
              type="text"
              hidden
            />
            <Textarea
              hidden
              height={120}
              resize="none"
              color="grey.700"
              background="#fff"
              borderRadius="sm"
            />
          </Wizard>
        </Box>
      </Flex>
    </Box>
  );
};
