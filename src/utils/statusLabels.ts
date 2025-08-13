import { JobStatus, JobPriority } from "../types/job";

export type Language = "en" | "he";

/**
 * Centralized status and priority label mappings
 * Eliminates duplication of translation logic across components
 */
export const getStatusLabel = (
  status: JobStatus,
  language: Language
): string => {
  const statusLabels: Record<JobStatus, Record<Language, string>> = {
    [JobStatus.Pending]: { en: "Pending", he: "ממתין" },
    [JobStatus.InQueue]: { en: "In Queue", he: "בתור" },
    [JobStatus.Running]: { en: "Running", he: "רץ" },
    [JobStatus.Completed]: { en: "Completed", he: "הושלמו" },
    [JobStatus.Failed]: { en: "Failed", he: "נכשלו" },
    [JobStatus.Stopped]: { en: "Stopped", he: "עצר" },
  };

  return statusLabels[status][language];
};

export const getPriorityLabel = (
  priority: JobPriority,
  language: Language
): string => {
  const priorityLabels: Record<JobPriority, Record<Language, string>> = {
    [JobPriority.Regular]: { en: "Regular", he: "רגיל" },
    [JobPriority.High]: { en: "High", he: "גבוה" },
  };

  return priorityLabels[priority][language];
};

export const getAllStatusLabels = (language: Language) => {
  return Object.values(JobStatus)
    .filter((value) => typeof value === "number")
    .map((status) => ({
      value: status as JobStatus,
      label: getStatusLabel(status as JobStatus, language),
    }));
};

export const getAllPriorityLabels = (language: Language) => {
  return Object.values(JobPriority)
    .filter((value) => typeof value === "number")
    .map((priority) => ({
      value: priority as JobPriority,
      label: getPriorityLabel(priority as JobPriority, language),
    }));
};
