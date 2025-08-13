import React from "react";
import { Text, Alert, AlertIcon } from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useI18n } from "../hooks/useI18n";
import { BaseModal } from "./common/BaseModal";
import { SelectField } from "./common/FormField";
import { useForm } from "../hooks/useForm";
import { useToastNotification } from "../hooks/useToastNotification";
import { useTheme } from "../hooks/useTheme";
import { getGrayColor } from "../theme";

interface DeleteJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteJobs: (status: number) => void;
}

interface FormData {
  selectedStatus: number | "";
}

export const DeleteJobsModal: React.FC<DeleteJobsModalProps> = ({
  isOpen,
  onClose,
  onDeleteJobs,
}) => {
  const { t } = useI18n();
  const { isDark } = useTheme();
  const { showSuccess, showError } = useToastNotification();

  const { values, errors, isSubmitting, setValue, handleSubmit, reset } =
    useForm<FormData>({
      initialValues: {
        selectedStatus: "",
      },
      validate: (values) => {
        const errors: Partial<Record<keyof FormData, string>> = {};
        if (values.selectedStatus === "") {
          errors.selectedStatus = t("validation.statusRequired");
        }
        return errors;
      },
      onSubmit: async (values) => {
        if (values.selectedStatus === "") return;

        try {
          await onDeleteJobs(values.selectedStatus as number);
          showSuccess({
            en: { success: t("notifications.jobsDeleted"), error: "" },
            he: { success: t("notifications.jobsDeleted"), error: "" },
          });
          handleClose();
        } catch (error) {
          showError(
            {
              en: { success: "", error: t("notifications.errorDeletingJobs") },
              he: { success: "", error: t("notifications.errorDeletingJobs") },
            },
            error instanceof Error ? error : undefined
          );
        }
      },
    });

  const handleClose = () => {
    reset();
    onClose();
  };

  const statusOptions = [JobStatus.Completed, JobStatus.Failed].map(
    (status) => ({
      value: status,
      label: t(
        `jobStatus.${status === JobStatus.Completed ? "completed" : "failed"}`
      ),
    })
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("modals.deleteJobs.title")}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={t("modals.deleteJobs.delete")}
      submitColorScheme="red"
    >
      <Alert status="warning">
        <AlertIcon />
        <Text fontSize="sm">{t("modals.deleteJobs.warning")}</Text>
      </Alert>

      <SelectField
        label={t("modals.deleteJobs.selectStatus")}
        value={values.selectedStatus}
        onChange={(value) =>
          setValue("selectedStatus", value === "" ? "" : parseInt(value))
        }
        placeholder={t("modals.deleteJobs.selectPlaceholder")}
        options={statusOptions}
        error={errors.selectedStatus}
        isRequired
      />

      {values.selectedStatus !== "" && (
        <Text fontSize="sm" color={getGrayColor("600", isDark)}>
          {t("modals.deleteJobs.confirmationText", {
            status:
              statusOptions.find((opt) => opt.value === values.selectedStatus)
                ?.label || "",
          })}
        </Text>
      )}
    </BaseModal>
  );
};
