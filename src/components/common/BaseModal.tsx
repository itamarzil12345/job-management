import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useLanguage } from "../../contexts/LanguageContext";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitText?: string;
  cancelText?: string;
  submitColorScheme?: string;
  size?: string;
}

/**
 * Reusable base modal component
 * Eliminates duplication between CreateJobModal and DeleteJobsModal
 */
export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitText,
  cancelText,
  submitColorScheme = "blue",
  size = "md",
}) => {
  const { language } = useLanguage();

  const defaultCancelText = language === "he" ? "ביטול" : "Cancel";
  const defaultSubmitText = language === "he" ? "אישור" : "Submit";

  const handleCancel = onCancel || onClose;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {children}
          </VStack>
        </ModalBody>

        {(onSubmit || onCancel) && (
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleCancel}>
              {cancelText || defaultCancelText}
            </Button>
            {onSubmit && (
              <Button
                colorScheme={submitColorScheme}
                onClick={onSubmit}
                isLoading={isSubmitting}
                loadingText={language === "he" ? "מעבד..." : "Processing..."}
              >
                {submitText || defaultSubmitText}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
