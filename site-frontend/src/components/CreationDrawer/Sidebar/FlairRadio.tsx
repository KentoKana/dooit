import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  useDisclosure,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { UseFormReturn, useWatch } from "react-hook-form";
import { IProject } from "..";

interface IFlairRadioProps {
  formHook: UseFormReturn<IProject, object>;
}

const flairs = [
  {
    label: "None",
    value: "-1",
    background: "#000",
  },
  { label: "Complete", value: "1", background: "primary" },
  { label: "In Progress", value: "0", background: "yellow.500" },
  {
    label: "I Need Help",
    value: "2",
    background: "purple.600",
  },
];

export const FlairRadio = observer(({ formHook }: IFlairRadioProps) => {
  const flairDisclosure = useDisclosure();
  const flairWatch = useWatch({
    name: "flair",
    defaultValue: "-1",
    control: formHook.control,
  });

  const selectedFlair = flairs.find((flair) => {
    return flair.value === flairWatch?.toString();
  });

  return (
    <>
      <Button
        textAlign="left"
        onClick={flairDisclosure.onToggle}
        variant="unstyled"
        w="100%"
      >
        <Text
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {formHook.watch("flair") && formHook.watch("flair") !== "-1" ? (
            <Flex width="100%">
              <Box mr={2}>Current Flair: </Box>
              <Tag
                variant="solid"
                background={selectedFlair?.background}
                cursor="pointer"
              >
                {selectedFlair?.label}
              </Tag>
            </Flex>
          ) : (
            <>Add Flair 🔥</>
          )}
          {flairDisclosure.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}{" "}
        </Text>
      </Button>
      <Collapse in={flairDisclosure.isOpen} animateOpacity>
        <RadioGroup
          defaultValue={selectedFlair?.value}
          value={formHook.watch("flair")}
          onChange={(value) => {
            formHook.setValue("flair", value);
            flairDisclosure.onToggle();
          }}
        >
          <Stack direction="column" p={3}>
            {flairs.map((option) => {
              return (
                <Radio key={option.value} value={option.value} cursor="pointer">
                  <Tag
                    variant="solid"
                    background={option.background}
                    cursor="pointer"
                  >
                    {option.label}
                  </Tag>
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>
      </Collapse>
    </>
  );
});
