import { Button, Flex, IconButton } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { DrawerTemplate } from "../../DrawerTemplate";
import { IMediaAreaProps, MediaArea } from ".";

interface IMediaAreaDrawerProps extends IMediaAreaProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaAreaDrawer = observer(
  ({ isOpen, onClose, selectedItemIndex, formHook }: IMediaAreaDrawerProps) => {
    return (
      <DrawerTemplate
        isOpen={isOpen}
        size="lg"
        placement="right"
        onClose={onClose}
        drawerFooter={
          <Flex position="absolute" bottom={0} m={1}>
            <Button
              ml={1}
              _hover={{ opacity: 1 }}
              opacity={1}
              className="mediabox"
              title="Save Item"
              variant="primary"
              icon={<CheckIcon />}
              aria-label="Save Item"
              onClick={() => {
                onClose();
              }}
            >
              Done
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
