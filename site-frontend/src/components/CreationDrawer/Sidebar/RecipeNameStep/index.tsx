import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Button, Flex } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import { DebounceInput } from "react-debounce-input";
import { useFormContext } from "react-hook-form";
import { useWizard } from "react-use-wizard";
import { IProject } from "../..";
import { ProjectCreateOptionsDto } from "../../../../Dtos/project/ProjectCreateOptionsDto.dto";
import { FormElement } from "../../../Forms/FormElement";
import { FlairRadio } from "../FlairRadio";

interface IRecipeNameStepProps {
  projectCreationOptions: ProjectCreateOptionsDto;
}

export const RecipeNameStep = ({
  projectCreationOptions,
}: IRecipeNameStepProps) => {
  const formHook = useFormContext<IProject>();
  const {
    watch,
    register,
    formState: { errors },
  } = formHook;

  const wizard = useWizard();

  return (
    <Box>
      <Box>
        <FormElement
          isRequired
          formLabel="Recipe Name"
          formFor={"name"}
          isInvalid={errors.name ? true : false}
          maxLengthDisplay={{
            currentLengthCount: formHook.watch("name").length,
            maxLength: 150,
          }}
          formField={
            <DebounceInput
              required
              maxLength={150}
              id="name"
              value={watch("name")}
              className="chakra-input css-r7n77o"
              placeholder="Name your recipe something catchy!"
              {...register("name", {
                required: "Please enter a name for your recipe",
              })}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                formHook.setValue(`name`, e.target.value);
              }}
            />
          }
          errorMessage={formHook.formState.errors.name && errors?.name?.message}
        />
        <FlairRadio
          flairs={projectCreationOptions.flairs}
          formHook={formHook}
        />
        <FormElement
          isRequired
          formLabel="Description"
          formFor={"projectDescription"}
          isInvalid={errors.projectDescription ? true : false}
          maxLengthDisplay={{
            currentLengthCount: watch("projectDescription").length,
            maxLength: 800,
          }}
          formField={
            <>
              <DebounceInput
                required
                value={watch("projectDescription")}
                className="chakra-textarea css-ry2iob"
                element="textarea"
                id="projectDescription"
                placeholder="E.g. Lembas bread, enough to fill a stomach of a grown man!"
                {...register("projectDescription", {
                  required: "Please enter a project description",
                })}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  formHook.setValue(`projectDescription`, e.target.value);
                }}
                maxLength={800}
              />
            </>
          }
          errorMessage={
            errors.projectDescription && errors.projectDescription.message
          }
        />
      </Box>
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
      <Flex justifyContent="flex-end" mt="20px">
        <Button
          mt="20px"
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
