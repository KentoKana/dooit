import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface IFormElementProps {
  isRequired?: boolean;
  formLabel: string;
  formFor: string;
  isInvalid: boolean;
  formField: ReactNode;
  errorMessage?: string;
  maxLengthDisplay?: {
    maxLength: number;
    currentLengthCount: number;
  };
}
export const FormElement = ({
  formLabel,
  isInvalid,
  formField,
  errorMessage,
  formFor,
  isRequired,
  maxLengthDisplay,
}: IFormElementProps) => {
  return (
    <FormControl isInvalid={isInvalid} my={3} isRequired={isRequired}>
      <FormLabel htmlFor={formFor} mr={0} mb={2}>
        {formLabel}:
      </FormLabel>
      {formField}
      {maxLengthDisplay && (
        <Box textAlign="right" opacity={0.7} fontSize="sm">
          {maxLengthDisplay.currentLengthCount}/{maxLengthDisplay.maxLength}
        </Box>
      )}
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};
