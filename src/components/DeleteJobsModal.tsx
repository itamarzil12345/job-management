import React from "react";
import { Text, Alert, AlertIcon } from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { BaseModal } from "./common/BaseModal";
import { SelectField } from "./common/FormField";
import { useForm } from "../hooks/useForm";
import { useToastNotification } from "../hooks/useToastNotification";
import { getStatusLabel } from "../utils/statusLabels";
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
  const { language } = useLanguage();
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
          errors.selectedStatus =
            language === "he" ? "חובה לבחור סטטוס" : "Status is required";
        }
        return errors;
      },
      onSubmit: async (values) => {
        if (values.selectedStatus === "") return;

        try {
          await onDeleteJobs(values.selectedStatus as number);
          showSuccess({
            en: { success: "Jobs deleted successfully", error: "" },
            he: { success: "העבודות נמחקו בהצלחה", error: "" },
          });
          handleClose();
        } catch (error) {
          showError(
            {
              en: { success: "", error: "Error deleting jobs" },
              he: { success: "", error: "שגיאה במחיקת העבודות" },
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
      label: getStatusLabel(status, language === "he" ? "he" : "en"),
    })
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        language === "he" ? "מחק עבודות לפי סטטוס" : "Delete Jobs by Status"
      }
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={language === "he" ? "מחק" : "Delete"}
      submitColorScheme="red"
    >
      <Alert status="warning">
        <AlertIcon />
        <Text fontSize="sm">
          {language === "he"
            ? "פעולה זו תמחק את כל העבודות עם הסטטוס הנבחר. פעולה זו אינה הפיכה."
            : "This action will delete all jobs with the selected status. This action cannot be undone."}
        </Text>
      </Alert>

      <SelectField
        label={
          language === "he" ? "בחר סטטוס למחיקה" : "Select Status to Delete"
        }
        value={values.selectedStatus}
        onChange={(value) =>
          setValue("selectedStatus", value === "" ? "" : parseInt(value))
        }
        placeholder={language === "he" ? "בחר סטטוס..." : "Select status..."}
        options={statusOptions}
        error={errors.selectedStatus}
        isRequired
      />

      {values.selectedStatus !== "" && (
        <Text fontSize="sm" color={getGrayColor("600", isDark)}>
          {language === "he"
            ? `זה ימחק את כל העבודות עם סטטוס "${getStatusLabel(
                values.selectedStatus as JobStatus,
                "he"
              )}".`
            : `This will delete all jobs with status "${getStatusLabel(
                values.selectedStatus as JobStatus,
                "en"
              )}".`}
        </Text>
      )}
    </BaseModal>
  );
};
