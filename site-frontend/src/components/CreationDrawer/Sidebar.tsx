import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { FormElement } from "../Forms/FormElement";
import { ProjectItems } from "./ProjectItems";
interface ISidebarProps {
  formHook: UseFormReturn<FieldValues, object>;
}

export const Sidebar = ({ formHook }: ISidebarProps) => {
  const {
    register,
    formState: { errors },
  } = formHook;
  return (
    <Box>
      <Box width="300px" mr={["40px"]}>
        <Box p={3}>
          <FormElement
            isRequired
            formLabel="Project Name"
            formFor={"name"}
            isInvalid={errors.name}
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
            errorMessage={errors.firstName && errors.firstName.message}
          />
        </Box>
        <Box>
          <Box
            p={3}
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
            <ProjectItems formHook={formHook} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
