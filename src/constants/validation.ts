/**
 * Centralized validation constants and rules
 * Ensures consistency across the application
 */

export const VALIDATION_RULES = {
  JOB_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_.]+$/,
  },
  SEARCH: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  PANEL_WIDTH: {
    MIN: 250,
    MAX_PERCENTAGE: 0.6,
  },
} as const;

export const ERROR_MESSAGES = {
  en: {
    jobNameRequired: "Job name is required",
    jobNameTooShort: `Job name must be at least ${VALIDATION_RULES.JOB_NAME.MIN_LENGTH} characters`,
    jobNameTooLong: `Job name must be less than ${VALIDATION_RULES.JOB_NAME.MAX_LENGTH} characters`,
    jobNameInvalidChars: "Job name contains invalid characters",
    statusRequired: "Status is required",
    networkError: "Network error occurred",
    unknownError: "An unknown error occurred",
  },
  he: {
    jobNameRequired: "שם העבודה הוא שדה חובה",
    jobNameTooShort: `שם העבודה חייב להיות לפחות ${VALIDATION_RULES.JOB_NAME.MIN_LENGTH} תווים`,
    jobNameTooLong: `שם העבודה חייב להיות פחות מ-${VALIDATION_RULES.JOB_NAME.MAX_LENGTH} תווים`,
    jobNameInvalidChars: "שם העבודה מכיל תווים לא חוקיים",
    statusRequired: "חובה לבחור סטטוס",
    networkError: "שגיאת רשת",
    unknownError: "שגיאה לא ידועה",
  },
} as const;

export type Language = keyof typeof ERROR_MESSAGES;
export type ErrorKey = keyof typeof ERROR_MESSAGES.en;
