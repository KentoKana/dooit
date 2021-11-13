import { Button, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { DrawerTemplate } from "../DrawerTemplate";
import { IMediaAreaProps, MediaArea } from "./MediaArea";

interface IMobileMediaAreaDrawerProps extends IMediaAreaProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMediaAreaDrawer = observer(
  ({
    isOpen,
    onClose,
    selectedItemIndex,
    formHook,
  }: IMobileMediaAreaDrawerProps) => {
    return (
      <DrawerTemplate
        isOpen={isOpen}
        size="full"
        placement="left"
        onClose={onClose}
        drawerHeader={
          <Flex justifyContent="flex-end">
            <Button
              variant="primary"
              borderRadius="sm"
              onClick={() => {
                onClose();
              }}
            >
              Save Item
            </Button>
          </Flex>
        }
      >
        <Flex width="100%" justifyContent="center">
          <MediaArea
            formHook={formHook}
            selectedItemIndex={selectedItemIndex}
          />
        </Flex>
      </DrawerTemplate>
    );
  }
);
