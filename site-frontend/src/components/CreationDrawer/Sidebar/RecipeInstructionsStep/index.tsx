import { Box, Flex } from "@chakra-ui/layout";
import { Button, Text } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { useWizard } from "react-use-wizard";
import { IProject } from "../..";
import { ProjectItems } from "../../ProjectItems";
interface IRecipeInstructionsProp {
  onItemSelect: (itemIndex: number) => void;
}

export const RecipeInstructions = ({
  onItemSelect,
}: IRecipeInstructionsProp) => {
  const wizard = useWizard();
  const formHook = useFormContext<IProject>();

  return (
    <Box>
      <Box
        mt={2}
        maxHeight="320px"
        overflow="auto"
        css={{
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "24px",
          },
        }}
      >
        <ProjectItems
          onItemSelect={(newSelectedIndex) => {
            onItemSelect(newSelectedIndex);
          }}
          formHook={formHook}
        />
      </Box>
      <Flex justifyContent="flex-end" mt="20px">
        <Button
          mr="10px"
          colorScheme="grey"
          onClick={() => {
            wizard.previousStep();
          }}
        >
          Previous
        </Button>
        <Button
          title="Submit and Create Recipe"
          type="submit"
          form="project-form"
          variant="primary"
        >
          <Text as="span">Create!</Text>
        </Button>
      </Flex>
    </Box>
  );
};
