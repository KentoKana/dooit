import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  Input,
  Button,
  DrawerFooter,
  DrawerHeader,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { DrawerTemplate } from "../DrawerTemplate";

interface ICreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreationDrawer = observer(
  ({ isOpen, onClose }: ICreationDrawerProps) => {
    return (
      <DrawerTemplate
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        placement="right"
        drawerHeader="Create Project"
        drawerFooter={
          <>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </>
        }
      >
        Hey this is a body
      </DrawerTemplate>
    );
  }
);
