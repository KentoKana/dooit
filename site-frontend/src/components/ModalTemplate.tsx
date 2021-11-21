import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface IModalTemplateProps {
  displayCloseButton?: boolean;
  children?: ReactNode;
  heading?: ReactNode;
  footer?: ReactNode;
  isOpen: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  onClose?: () => void;
}
export const ModalTemplate = ({
  displayCloseButton,
  children,
  heading,
  footer,
  isOpen,
  size = "xl",
  onClose,
}: IModalTemplateProps) => {
  return (
    <Modal
      isCentered
      onClose={() => {
        onClose && onClose();
      }}
      size={size}
      isOpen={isOpen}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent borderRadius="sm">
        {heading && <ModalHeader>{heading}</ModalHeader>}
        {displayCloseButton && <ModalCloseButton />}
        {children && <ModalBody p={0}>{children}</ModalBody>}
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
