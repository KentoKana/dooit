import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import { Textarea } from "@chakra-ui/textarea";
import { observer } from "mobx-react-lite";
import { ModalTemplate } from "../ModalTemplate";

interface IStoryItemModal {
  isOpen: boolean;
  onClose: () => void;
}
export const StoryItemModal = observer(
  ({ isOpen, onClose }: IStoryItemModal) => {
    return (
      <ModalTemplate
        isOpen={isOpen}
        onClose={onClose}
        heading={
          <FormControl isRequired>
            <FormLabel color="grey.500" htmlFor="title">
              Title:
            </FormLabel>
            <Input id="title" placeholder="Title" borderRadius={2} />
          </FormControl>
        }
        footer={
          <Flex justifyContent="space-between" width="100%">
            <Button borderRadius={2} onClick={onClose}>
              Cancel
            </Button>
            <Button borderRadius={2} onClick={onClose} variant="primary">
              Save Item
            </Button>
          </Flex>
        }
      >
        <FormLabel color="grey.500" htmlFor="description">
          Description:
        </FormLabel>
        <Textarea id="description" placeholder="Description" borderRadius={2} />
      </ModalTemplate>
    );
  }
);
