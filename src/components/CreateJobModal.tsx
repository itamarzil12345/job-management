import React, { useEffect } from "react";
import { JobPriority } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { BaseModal } from "./common/BaseModal";
import { InputField, SelectField } from "./common/FormField";
import { useForm } from "../hooks/useForm";
import { useToastNotification } from "../hooks/useToastNotification";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { getPriorityLabel } from "../utils/statusLabels";
import { validateJobName } from "../utils/validation";
import { getErrorMessage } from "../utils/validation";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (name: string, priority: number) => void;
}

interface FormData {
  name: string;
  priority: JobPriority;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onCreateJob,
}) => {
  const { language } = useLanguage();
  const { showSuccess, showError } = useToastNotification();

  const {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
    reset,
    cleanup,
  } = useForm<FormData>({
    initialValues: {
      name: "",
      priority: JobPriority.Regular,
    },
    validate: (values) => {
      const errors: Partial<Record<keyof FormData, string>> = {};

      const nameValidation = validateJobName(values.name);
      if (!nameValidation.isValid && nameValidation.errorKey) {
        errors.name = getErrorMessage(
          nameValidation.errorKey,
          language === "he" ? "he" : "en"
        );
      }

      return errors;
    },
    onSubmit: async (values) => {
      await onCreateJob(values.name.trim(), values.priority);
      showSuccess({
        en: { success: "Job created successfully", error: "" },
        he: { success: "העבודה נוצרה בהצלחה", error: "" },
      });
      handleClose();
    },
    onError: (error) => {
      showError(
        {
          en: { success: "", error: "Error creating job" },
          he: { success: "", error: "שגיאה ביצירת העבודה" },
        },
        error
      );
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Keyboard navigation
  useKeyboardNavigation({
    onEscape: handleClose,
    onEnter: handleSubmit,
    enabled: isOpen,
  });

  const priorityOptions = [
    {
      value: JobPriority.Regular,
      label: getPriorityLabel(JobPriority.Regular, language),
    },
    {
      value: JobPriority.High,
      label: getPriorityLabel(JobPriority.High, language),
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={language === "he" ? "צור עבודה חדשה" : "Create New Job"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={language === "he" ? "צור" : "Create"}
      submitColorScheme="blue"
    >
      <InputField
        label={language === "he" ? "שם העבודה" : "Job Name"}
        value={values.name}
        onChange={(value) => setValue("name", value)}
        placeholder={
          language === "he" ? "הכנס שם עבודה..." : "Enter job name..."
        }
        error={errors.name}
        isRequired
        autoFocus
      />

      <SelectField
        label={language === "he" ? "עדיפות" : "Priority"}
        value={values.priority}
        onChange={(value) => setValue("priority", parseInt(value))}
        options={priorityOptions}
        error={errors.priority}
      />
    </BaseModal>
  );
};
