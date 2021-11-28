import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { DebounceInput } from "react-debounce-input";
import { UseFormReturn } from "react-hook-form";
import { IProject } from "..";
import { ProjectCreateOptionsDto } from "../../../Dtos/ProjectCreateOptionsDto.dto";
import { FormElement } from "../../Forms/FormElement";
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
  } = formHook;

  return (
    <Box>
      <Box width="100%" mr={["40px"]}>
        <Box>
          <FormElement
            isRequired
            formLabel="Project Name"
            formFor={"name"}
            isInvalid={errors.name ? true : false}
            maxLengthDisplay={{
              currentLengthCount: formHook.watch("name").length,
              maxLength: 150,
            }}
            formField={
              <Input
                maxLength={150}
                color="grey.700"
                background="#fff"
                borderRadius="sm"
                id="name"
                type="text"
                placeholder="Name your project with something catchy!"
                {...register("name", {
                  required: "Please enter a project name",
                })}
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
              currentLengthCount: formHook.watch("projectDescription").length,
              maxLength: 800,
            }}
            formField={
              <>
                <DebounceInput
                  required
                  value={formHook.watch("projectDescription")}
                  className="chakra-textarea css-ry2iob"
                  element="textarea"
                  id="projectDescription"
                  placeholder="E.g. I built a desk with recycled cedar wood..."
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
        <Textarea
          hidden
          height={120}
          resize="none"
          color="grey.700"
          background="#fff"
          borderRadius="sm"
        />
      </Box>
    </Box>
  );
};
