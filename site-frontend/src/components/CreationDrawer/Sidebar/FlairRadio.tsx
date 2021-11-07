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
import { ProjectFlairsDto } from "../../../Dtos/ProjectFlairsDto.dto";

interface IFlairRadioProps {
  formHook: UseFormReturn<IProject, object>;
  flairs: ProjectFlairsDto[];
}

export const FlairRadio = observer(({ formHook, flairs }: IFlairRadioProps) => {
  const flairWatch = useWatch({
    name: "flair",
    control: formHook.control,
  });
  const flairDisclosure = useDisclosure({
    defaultIsOpen: flairWatch === "-1",
  });

  const selectedFlair = flairs.find((flair) => {
    return flair.id.toString() === flairWatch;
  });
  console.log(selectedFlair);

  return (
    <>
      <Button
        borderRadius="sm"
        p={2}
        background="grey.50"
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
                color={selectedFlair?.isDarkText ? "grey.700" : "#fff"}
                variant="solid"
                background={selectedFlair?.backgroundColor}
                cursor="pointer"
              >
                {selectedFlair?.flairLabel}
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
            {[
              {
                flairLabel: "None",
                id: -1,
                backgroundColor: "grey.700",
                isDarkText: false,
              },
              ...flairs,
            ].map((option) => {
              return (
                <Radio
                  key={option.id}
                  value={option.id.toString()}
                  cursor="pointer"
                >
                  <Tag
                    color={option.isDarkText ? "grey.700" : "#fff"}
                    variant="solid"
                    background={option.backgroundColor}
                    cursor="pointer"
                  >
                    {option.flairLabel}
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
