import { Input } from "@chakra-ui/input";
import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import Creatable from "react-select/creatable";
import { IIngredient, IProject } from "..";
import { FormElement } from "../../Forms/FormElement";

interface IIngredientEditorProps {
  formHook: UseFormReturn<IProject, object>;
  isOpen: boolean;
  onClose: () => void;
  ingredientIndex: number;
  onAddIngredient: (ingredient: IIngredient) => void;
}

export const IngredientEditor = observer(
  ({
    formHook,
    isOpen,
    onClose,
    ingredientIndex: index,
    onAddIngredient,
  }: IIngredientEditorProps) => {
    const [ingredientOptions, setIngredientOptions] = useState<
      { label: string; value: string }[]
    >([
      { label: "Carrot", value: "Carrot" },
      { label: "Milk", value: "Milk" },
    ]);
    const [addedIngredient, setAddedIngredient] = useState<IIngredient>({
      ingredient: "",
      quantity: 0,
      unit: "",
    });
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <FormElement
              formLabel="Ingredient"
              formField={
                <Controller
                  control={formHook.control}
                  name={`ingredients`}
                  render={({ field, fieldState, formState }) => (
                    <Creatable
                      isClearable
                      ref={field.ref}
                      options={ingredientOptions}
                      value={{
                        label: addedIngredient.ingredient,
                        value: addedIngredient.ingredient,
                      }}
                      onChange={(opt) => {
                        setAddedIngredient((prev) => {
                          if (prev) {
                            return {
                              ...prev,
                              ingredient: opt?.value ?? "",
                            };
                          }
                          return prev;
                        });
                        // formHook.setValue(
                        //   `ingredients.${index}.ingredient`,
                        //   opt?.value ?? ""
                        // );
                      }}
                      onCreateOption={(opt) => {
                        setIngredientOptions((prev) => {
                          return [...prev, { label: opt, value: opt }];
                        });

                        setAddedIngredient((prev) => {
                          return {
                            ...prev,
                            ingredient: opt ?? "",
                          };
                        });
                        // formHook.setValue(
                        //   `ingredients.${index}.ingredient`,
                        //   opt
                        // );
                      }}
                    />
                  )}
                />
              }
              formFor="ingredient"
              isInvalid={false}
            />
            <FormElement
              formLabel="Qty"
              formField={
                <NumberInput id="quantity">
                  <NumberInputField
                    value={addedIngredient.quantity}
                    onChange={(e) => {
                      setAddedIngredient((prev) => {
                        return {
                          ...prev,
                          quantity: parseInt(e.target.value),
                        };
                      });
                    }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              }
              formFor="quantity"
              errorMessage={
                formHook?.formState?.errors?.ingredients?.[index]?.quantity
                  ?.message
              }
              isInvalid={false}
            />
            <FormElement
              formLabel="Unit"
              formField={
                <Input
                  onChange={(e) => {
                    setAddedIngredient((prev) => {
                      return {
                        ...prev,
                        unit: e.target.value,
                      };
                    });
                  }}
                />
              }
              formFor="unit"
              isInvalid={false}
            />
            <Box>
              <Button
                onClick={() => {
                  if (addedIngredient) {
                    onAddIngredient(addedIngredient);
                  }
                  onClose();
                  setAddedIngredient({ ingredient: "", quantity: 0, unit: "" });
                }}
              >
                Add Ingredient
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
);
