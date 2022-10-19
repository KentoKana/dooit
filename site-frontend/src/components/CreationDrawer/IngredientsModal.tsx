import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import {
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import Creatable from "react-select/creatable";
import { IProject } from ".";
import { FormElement } from "../Forms/FormElement";

interface IIngredientsModalProps {
  formHook: UseFormReturn<IProject, object>;
  isOpen: boolean;
  onClose: () => void;
}

export const IngredientsModal = ({
  formHook,
  isOpen,
  onClose,
}: IIngredientsModalProps) => {
  const [ingredientOptions, setIngredientOptions] = useState<
    { label: string; value: string }[]
  >([
    { label: "Carrot", value: "Carrot" },
    { label: "Milk", value: "Milk" },
  ]);
  const {
    register,
    formState: { errors },
    watch,
  } = formHook;

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Add Ingredients</ModalHeader>
        <ModalBody>
          <Flex>
            <Box width="60%" mr="10px">
              <FormElement
                formLabel="Ingredient"
                formField={
                  <Controller
                    control={formHook.control}
                    name="ingredients"
                    render={({ field, fieldState, formState }) => (
                      <Creatable
                        isClearable
                        ref={field.ref}
                        options={ingredientOptions}
                        value={ingredientOptions.find(
                          (opt) => opt.value === field.value?.[0]?.ingredient
                        )}
                        onChange={(opt) => {
                          formHook.setValue(
                            `ingredients.${0}.ingredient`,
                            opt?.value ?? ""
                          );
                        }}
                        onCreateOption={(opt) => {
                          setIngredientOptions((prev) => {
                            return [...prev, { label: opt, value: opt }];
                          });
                          formHook.setValue(`ingredients.${0}.ingredient`, opt);
                        }}
                      />
                    )}
                  />
                }
                formFor="ingredient"
                isInvalid={false}
              />
            </Box>
            <Box width="20%" mr="10px">
              <FormElement
                formLabel="Quantity"
                formField={
                  <NumberInput id="quantity">
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                }
                formFor="quantity"
                isInvalid={false}
              />
            </Box>
            <Box width="20%">
              <FormElement
                formLabel="Unit"
                formField={<Input id="unit" />}
                formFor="unit"
                isInvalid={false}
              />
            </Box>
            {/* <Input mr="2" width="30%" /> */}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
