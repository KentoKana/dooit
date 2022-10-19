import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/textarea";
import { DebounceInput } from "react-debounce-input";
import { UseFormReturn } from "react-hook-form";
import { IProject } from "..";
import { ProjectCreateOptionsDto } from "../../../Dtos/project/ProjectCreateOptionsDto.dto";
import { FormElement } from "../../Forms/FormElement";
import { IngredientsModal } from "../IngredientsModal";
import { ProjectItems } from "../ProjectItems";
import { FlairRadio } from "./FlairRadio";
interface ISidebarProps {
  onItemSelect: (itemIndex: number) => void;
  formHook: UseFormReturn<IProject, object>;
  projectCreationOptions: ProjectCreateOptionsDto;
}

export const Sidebar = ({
  formHook,
  onItemSelect,
  projectCreationOptions,
}: ISidebarProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = formHook;
  const ingredientsModalDisclosure = useDisclosure();

  return (
    <Box>
      <Flex justifyContent="center">
        <Box width="100%" maxW="800px">
          <Box>
            <FormElement
              isRequired
              formLabel="Recipe Name"
              formFor={"name"}
              isInvalid={errors.name ? true : false}
              maxLengthDisplay={{
                currentLengthCount: watch("name").length,
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
              errorMessage={errors.name && errors.name.message}
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
          <Box>
            <Button
              colorScheme="primary"
              w="100%"
              borderRadius="sm"
              onClick={() => ingredientsModalDisclosure.onOpen()}
            >
              Add Ingredients +
            </Button>
            <IngredientsModal
              isOpen={ingredientsModalDisclosure.isOpen}
              onClose={ingredientsModalDisclosure.onClose}
              formHook={formHook}
            />
          </Box>
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
        </Box>
      </Flex>
    </Box>
  );
};
