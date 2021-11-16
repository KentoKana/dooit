import { Flex, Button } from "@chakra-ui/react";
import { ModalTemplate } from "../../ModalTemplate";
interface IItemRemovalConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onRemoveConfirm: () => void;
}
export const ItemRemovalConfirmationModal = ({
  isOpen,
  onCancel,
  onRemoveConfirm,
}: IItemRemovalConfirmationModalProps) => {
  return (
    <ModalTemplate
      size="md"
      heading="Are you sure you want to delete this item?"
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
            colorScheme="red"
            borderRadius="sm"
            onClick={() => {
              onRemoveConfirm();
            }}
          >
            Yes, Remove it
          </Button>
        </Flex>
      }
    />
  );
};
