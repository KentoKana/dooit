import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

interface IDrawerTemplateProps {
  drawerHeader?: ReactNode;
  drawerFooter?: ReactNode;
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  placement: "right" | "top" | "bottom" | "left";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  closeOnEsc?: boolean;
}

export const DrawerTemplate = observer(
  ({
    size = "lg",
    placement = "left",
    children,
    drawerFooter,
    drawerHeader,
    isOpen,
    onClose,
    closeOnEsc,
  }: IDrawerTemplateProps) => {
    return (
      <Drawer
        closeOnEsc={closeOnEsc}
        isOpen={isOpen}
        placement={placement}
        onClose={onClose}
        size={size}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {drawerHeader && <DrawerHeader>{drawerHeader}</DrawerHeader>}
          {children && <DrawerBody>{children}</DrawerBody>}
          {drawerFooter && <DrawerFooter>{drawerFooter}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }
);
