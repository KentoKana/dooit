import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { DrawerTemplate } from "../DrawerTemplate";
import { ProjectItem } from "./ProjectItem";

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
        <ProjectItem />
      </DrawerTemplate>
    );
  }
);
