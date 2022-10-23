import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
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

  const ingredientArray = useFieldArray({
    control: formHook.control,
    name: "ingredients",
  });

  console.log(formHook.formState.errors);

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Add Ingredients</ModalHeader>
        <ModalBody>
          <TableContainer overflowY="visible">
            <Table>
              <Thead>
                <Tr>
                  <Th>Ingredient</Th>
                  <Th>Quantity</Th>
                  <Th>Unit</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {ingredientArray.fields.map((ingredient, index) => {
                  return (
                    <Tr key={ingredient.id}>
                      <Td p="2">
                        <FormElement
                          formField={
                            <Controller
                              control={formHook.control}
                              name={`ingredients`}
                              render={({ field, fieldState, formState }) => (
                                <Creatable
                                  isClearable
                                  ref={field.ref}
                                  options={ingredientOptions}
                                  value={ingredientOptions.find(
                                    (opt) =>
                                      opt.value ===
                                      field.value?.[index]?.ingredient
                                  )}
                                  onChange={(opt) => {
                                    formHook.setValue(
                                      `ingredients.${index}.ingredient`,
                                      opt?.value ?? ""
                                    );
                                  }}
                                  onCreateOption={(opt) => {
                                    setIngredientOptions((prev) => {
                                      return [
                                        ...prev,
                                        { label: opt, value: opt },
                                      ];
                                    });
                                    formHook.setValue(
                                      `ingredients.${index}.ingredient`,
                                      opt
                                    );
                                  }}
                                />
                              )}
                            />
                          }
                          formFor="ingredient"
                          isInvalid={
                            !!formHook?.formState?.errors?.ingredients?.[index]
                              ?.ingredient
                          }
                        />
                      </Td>
                      <Td p="2" w="20px">
                        <FormElement
                          formField={
                            <NumberInput id="quantity">
                              <NumberInputField
                                min={0}
                                {...formHook.register(
                                  `ingredients.${index}.quantity`,
                                  {
                                    required: "Please enter a quantity",
                                    valueAsNumber: true,
                                  }
                                )}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          }
                          formFor="quantity"
                          errorMessage={
                            formHook?.formState?.errors?.ingredients?.[index]
                              ?.quantity?.message
                          }
                          isInvalid={
                            !!formHook?.formState?.errors?.ingredients?.[index]
                              ?.quantity
                          }
                        />
                      </Td>
                      <Td p="2" w="90px">
                        <FormElement
                          formField={<Input id="unit" />}
                          formFor="unit"
                          isInvalid={false}
                        />
                      </Td>
                      <Td p="2" w="30px">
                        <IconButton
                          colorScheme="red"
                          ml={2}
                          aria-label="Remove"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            ingredientArray.remove(index);
                          }}
                        />
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td colSpan={5} p="2" textAlign="right">
                    <Button
                      variant="link"
                      colorScheme="red"
                      backgroundColor="transparent"
                      onClick={() => {
                        ingredientArray.remove();
                        ingredientArray.append({
                          ingredient: "",
                          quantity: 0,
                          unit: "",
                        });
                      }}
                    >
                      Clear All
                    </Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={5} p="0">
                    <Button
                      w="100%"
                      colorScheme="primary"
                      mt={3}
                      borderRadius={"sm"}
                      onClick={() => {
                        ingredientArray.append({
                          ingredient: "",
                          quantity: 0,
                          unit: "",
                        });
                      }}
                    >
                      + Add Ingredient
                    </Button>
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={5} p="0">
                    <Button
                      w="100%"
                      borderRadius={"sm"}
                      colorScheme="green"
                      mt={3}
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <CheckIcon mr={2} />
                      Done
                    </Button>
                  </Td>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
          {/* <Button
            colorScheme="primary"
            width="100%"
            mt={3}
            borderRadius={"sm"}
            onClick={() => {
              ingredientArray.append({
                ingredient: "",
                quantity: 0,
                unit: "",
              });
            }}
          >
            + Add Ingredient
          </Button>
          <Button
            borderRadius={"sm"}
            colorScheme="green"
            width="100%"
            mt={3}
            onClick={() => {
              onClose();
            }}
          >
            <CheckIcon mr={2} />
            Done
          </Button> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
