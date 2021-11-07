import {
  SmallAddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
} from "@chakra-ui/icons";
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
    background: "grey.700",
  },
  { label: "Project Complete", value: "0", background: "primary" },
  { label: "Project In Progress", value: "1", background: "yellow.500" },
  {
    label: "I Need Help",
    value: "2",
    background: "red.500",
  },
];

export const FlairRadio = observer(({ formHook }: IFlairRadioProps) => {
  const flairWatch = useWatch({
    name: "flair",
    control: formHook.control,
  });
  const flairDisclosure = useDisclosure({
    defaultIsOpen: flairWatch === "-1",
  });

  const selectedFlair = flairs.find((flair) => {
    return flair.value === flairWatch;
  });
  console.log(flairWatch);

  return (
    <>
      <Button
        fontWeight="normal"
        textAlign="left"
        onClick={flairDisclosure.onToggle}
        variant="unstyled"
        w="100%"
        h="100%"
      >
        <Text
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {flairWatch && flairWatch !== "-1" ? (
            <Flex>
              {/* <Box as="span" mr={2}>
                Flair:{" "}
              </Box> */}
              <Tag
                variant="solid"
                background={selectedFlair?.background}
                cursor="pointer"
              >
                {selectedFlair?.label}
              </Tag>
            </Flex>
          ) : (
            <Flex alignItems="center">
              <SmallAddIcon mr={1} /> Add Flair 🔥
            </Flex>
          )}
          {flairWatch && flairWatch !== "-1" ? (
            <EditIcon />
          ) : flairDisclosure.isOpen ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )}{" "}
        </Text>
      </Button>
      <Collapse in={flairDisclosure.isOpen} animateOpacity>
        <RadioGroup
          value={flairWatch}
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
