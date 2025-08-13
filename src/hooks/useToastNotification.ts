import { useToast } from "@chakra-ui/react";
import { useLanguage } from "../contexts/LanguageContext";

export interface ToastMessage {
  success: string;
  error: string;
}

export interface BilingualToastMessage {
  en: ToastMessage;
  he: ToastMessage;
}

/**
 * Custom hook for consistent toast notifications with internationalization
 * Eliminates duplicate toast logic across components
 */
export const useToastNotification = () => {
  const toast = useToast();
  const { language } = useLanguage();

  const showToast = (
    messages: BilingualToastMessage,
    type: "success" | "error",
    error?: Error
  ) => {
    const message = language === "he" ? messages.he : messages.en;
    const title = type === "success" ? message.success : message.error;

    toast({
      title,
      description: error ? error.message : undefined,
      status: type,
      duration: type === "success" ? 3000 : 5000,
      isClosable: true,
    });
  };

  const showSuccess = (messages: BilingualToastMessage) => {
    showToast(messages, "success");
  };

  const showError = (messages: BilingualToastMessage, error?: Error) => {
    showToast(messages, "error", error);
  };

  return {
    showSuccess,
    showError,
  };
};
