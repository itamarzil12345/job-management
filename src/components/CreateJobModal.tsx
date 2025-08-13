import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  FormErrorMessage,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { JobPriority } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (name: string, priority: number) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onCreateJob,
}) => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    priority: JobPriority.Regular,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = { name: "" };

    if (!formData.name.trim()) {
      newErrors.name =
        language === "he" ? "שם העבודה הוא שדה חובה" : "Job name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        language === "he"
          ? "שם העבודה חייב להיות לפחות 3 תווים"
          : "Job name must be at least 3 characters";
    }

    setErrors(newErrors);
    return !newErrors.name;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onCreateJob(formData.name.trim(), formData.priority);
      toast({
        title:
          language === "he"
            ? "העבודה נוצרה בהצלחה"
            : "Job created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title: language === "he" ? "שגיאה ביצירת העבודה" : "Error creating job",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", priority: JobPriority.Regular });
    setErrors({ name: "" });
    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field === "name" && errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {language === "he" ? "צור עבודה חדשה" : "Create New Job"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>
                {language === "he" ? "שם העבודה" : "Job Name"}
              </FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={
                  language === "he" ? "הכנס שם עבודה..." : "Enter job name..."
                }
                autoFocus
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>{language === "he" ? "עדיפות" : "Priority"}</FormLabel>
              <Select
                value={formData.priority}
                onChange={(e) =>
                  handleInputChange("priority", parseInt(e.target.value))
                }
              >
                <option value={JobPriority.Regular}>
                  {language === "he" ? "רגיל" : "Regular"}
                </option>
                <option value={JobPriority.High}>
                  {language === "he" ? "גבוה" : "High"}
                </option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            {language === "he" ? "ביטול" : "Cancel"}
          </Button>
          <Button
            colorScheme={isDark ? "blue" : "blue"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText={language === "he" ? "יוצר..." : "Creating..."}
          >
            {language === "he" ? "צור" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
