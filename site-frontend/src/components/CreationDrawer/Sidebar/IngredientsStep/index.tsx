import { Box } from "@chakra-ui/layout";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { GiKnifeFork } from "react-icons/gi";
import { useWizard } from "react-use-wizard";
import { IProject } from "../..";
import { IngredientsModal } from "../../IngredientsModal";

interface IIngredientsStepProps {}

export const IngredientsStep = ({}: IIngredientsStepProps) => {
  const formHook = useFormContext<IProject>();

  const {
    formState: { errors },
  } = formHook;
  const wizard = useWizard();
  const ingredientsModalDisclosure = useDisclosure();

  return (
    <Box>
      <Button
        colorScheme="primary"
        w="100%"
        borderRadius="sm"
        onClick={() => ingredientsModalDisclosure.onOpen()}
      >
        <GiKnifeFork style={{ marginRight: 5 }} /> Add Ingredients
      </Button>
      <IngredientsModal
        isOpen={ingredientsModalDisclosure.isOpen}
        onClose={ingredientsModalDisclosure.onClose}
        formHook={formHook}
      />
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
          colorScheme="purple"
          onClick={() => {
            wizard.nextStep();
          }}
        >
          Next Step
        </Button>
      </Flex>
    </Box>
  );
};
