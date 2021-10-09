import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IFormElementProps {
  formLabel: string;
  formFor: string;
  isInvalid: boolean;
  formField: ReactNode;
  errorMessage?: string;
}
export const FormElement = ({
  formLabel,
  isInvalid,
  formField,
  errorMessage,
  formFor,
}: IFormElementProps) => {
  return (
    <FormControl isInvalid={isInvalid} mb={3}>
      <FormLabel htmlFor={formFor} mr={0} mb={2}>
        {formLabel}:
      </FormLabel>
      {formField}
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};
