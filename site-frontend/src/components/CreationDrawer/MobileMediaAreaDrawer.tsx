import { Flex, IconButton } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
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
        drawerFooter={
          <Flex position="absolute" bottom={0} m={1}>
            <IconButton
              ml={1}
              _hover={{ opacity: 1 }}
              opacity={1}
              className="mediabox"
              width="60px"
              height="60px"
              borderRadius="50%"
              title="Save Item"
              variant="primary"
              icon={<CheckIcon />}
              aria-label="Save Item"
              onClick={() => {
                onClose();
              }}
            />
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
