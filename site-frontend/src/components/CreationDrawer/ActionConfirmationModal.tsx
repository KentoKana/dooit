import { Flex, Button } from "@chakra-ui/react";
import { ReactNode } from "react";
import { ModalTemplate } from "../ModalTemplate";
interface IActionConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmButtonLabel: ReactNode;
  modalHeading: string;
  confirmButtonColorScheme?: string;
}
export const ActionConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
  confirmButtonLabel,
  modalHeading,
  confirmButtonColorScheme = "red",
}: IActionConfirmationModalProps) => {
  return (
    <ModalTemplate
      size="md"
      heading={modalHeading}
      isOpen={isOpen}
      footer={
        <Flex justifyContent="space-between" w="100%">
          <Button
            variant="outline"
            borderRadius="sm"
            mr="2"
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme={confirmButtonColorScheme}
            borderRadius="sm"
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmButtonLabel}
          </Button>
        </Flex>
      }
    />
  );
};
