import React, { useEffect } from "react";
import { JobPriority } from "../types/job";
import { useI18n } from "../hooks/useI18n";
import { BaseModal } from "./common/BaseModal";
import { InputField, SelectField } from "./common/FormField";
import { useForm } from "../hooks/useForm";
import { useToastNotification } from "../hooks/useToastNotification";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { validateJobName } from "../utils/validation";

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
  const { t } = useI18n();
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
        errors.name = t(`validation.${nameValidation.errorKey}`);
      }

      return errors;
    },
    onSubmit: async (values) => {
      await onCreateJob(values.name.trim(), values.priority);
      showSuccess({
        en: { success: t("notifications.jobCreated"), error: "" },
        he: { success: t("notifications.jobCreated"), error: "" },
      });
      handleClose();
    },
    onError: (error) => {
      showError(
        {
          en: { success: "", error: t("notifications.errorCreatingJob") },
          he: { success: "", error: t("notifications.errorCreatingJob") },
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
      label: t("jobPriority.regular"),
    },
    {
      value: JobPriority.High,
      label: t("jobPriority.high"),
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("modals.createJob.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={t("modals.createJob.create")}
      submitColorScheme="blue"
    >
      <InputField
        label={t("modals.createJob.jobName")}
        value={values.name}
        onChange={(value) => setValue("name", value)}
        placeholder={t("modals.createJob.jobNamePlaceholder")}
        error={errors.name}
        isRequired
        autoFocus
      />

      <SelectField
        label={t("modals.createJob.priority")}
        value={values.priority}
        onChange={(value) => setValue("priority", parseInt(value))}
        options={priorityOptions}
        error={errors.priority}
      />
    </BaseModal>
  );
};
