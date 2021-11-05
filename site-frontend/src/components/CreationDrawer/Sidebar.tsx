import {
  ChevronDownIcon,
  ChevronRightIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Stack } from "@chakra-ui/layout";
import {
  Button,
  Collapse,
  Radio,
  RadioGroup,
  Select,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
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
  const flairDisclosure = useDisclosure();
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
          <Button
            textAlign="left"
            leftIcon={<SmallAddIcon />}
            onClick={flairDisclosure.onToggle}
            variant="unstyled"
            w="100%"
          >
            Add Flair 🔥
          </Button>
          <Collapse in={flairDisclosure.isOpen} animateOpacity>
            <RadioGroup
              value={formHook.watch("flair")}
              onChange={(value) => {
                formHook.setValue("flair", value);
              }}
            >
              <Stack direction="column" p={3}>
                {[
                  { label: "Complete", value: "1", background: "primary" },
                  { label: "In Progress", value: "0", background: "blue.600" },
                  {
                    label: "I Need Help",
                    value: "2",
                    background: "purple.600",
                  },
                ].map((option) => {
                  return (
                    <Radio key={option.value} value={option.value}>
                      <Tag variant="solid" background={option.background}>
                        {option.label}
                      </Tag>
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
          </Collapse>
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
