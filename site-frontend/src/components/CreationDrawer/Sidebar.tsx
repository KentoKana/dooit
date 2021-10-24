import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { UseFormReturn } from "react-hook-form";
import { IProject } from ".";
import { FormElement } from "../Forms/FormElement";
import { ProjectItems } from "./ProjectItems";
interface ISidebarProps {
  onItemSelect: (itemIndex: number) => void;
  formHook: UseFormReturn<IProject, object>;
}

export const Sidebar = ({ formHook, onItemSelect }: ISidebarProps) => {
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
            formField={
              <Input
                borderRadius="sm"
                id="name"
                type="text"
                placeholder="Project Name"
                {...register("name", {
                  required: "Please enter a project name",
                })}
              />
            }
            errorMessage={errors.name && errors.name.message}
          />
        </Box>
        <Box>
          <Box
            maxHeight="600px"
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
      </Box>
    </Box>
  );
};
