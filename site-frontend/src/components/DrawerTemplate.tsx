import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerProps,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

interface IDrawerTemplateProps extends DrawerProps {
  drawerHeader?: ReactNode;
  drawerFooter?: ReactNode;
  children: ReactNode;
}

export const DrawerTemplate = observer(
  ({
    size = "lg",
    placement = "left",
    children,
    drawerFooter,
    drawerHeader,
    ...props
  }: IDrawerTemplateProps) => {
    return (
      <Drawer {...props} placement={placement} size={size}>
        <DrawerOverlay />
        <DrawerContent>
          {/* <DrawerCloseButton /> */}
          {drawerHeader && (
            <DrawerHeader
              borderBottom="1px solid"
              borderColor="grey.100"
              height="80px"
            >
              {drawerHeader}
            </DrawerHeader>
          )}
          {children && <DrawerBody p="0">{children}</DrawerBody>}
          {drawerFooter && <DrawerFooter p="0">{drawerFooter}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }
);
