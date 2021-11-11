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
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
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

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          color={!selectedFlair || selectedFlair?.isDarkText ? "#000" : "#fff"}
          borderRadius="sm"
          p={2}
          background={selectedFlair?.backgroundColor ?? "grey.50"}
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
                  fontWeight="600"
                  color={selectedFlair?.isDarkText ? "grey.700" : "#fff"}
                  variant="solid"
                  background={selectedFlair?.backgroundColor}
                  cursor="pointer"
                >
                  {selectedFlair?.flairLabel}
                </Tag>
              </Flex>
            ) : (
              <Flex alignItems="center" fontWeight="600">
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
        </MenuButton>
        <MenuList w="100%">
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
                  <MenuItem key={option.id}>
                    <Radio value={option.id.toString()} cursor="pointer">
                      <Tag
                        color={option.isDarkText ? "grey.700" : "#fff"}
                        variant="solid"
                        background={option.backgroundColor}
                        cursor="pointer"
                      >
                        {option.flairLabel}
                      </Tag>
                    </Radio>
                  </MenuItem>
                );
              })}
            </Stack>
          </RadioGroup>
        </MenuList>
      </Menu>
    </>
  );
});
