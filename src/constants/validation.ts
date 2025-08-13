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
    JOB_NAME_REQUIRED: "Job name is required",
    JOB_NAME_TOO_SHORT: `Job name must be at least ${VALIDATION_RULES.JOB_NAME.MIN_LENGTH} characters`,
    JOB_NAME_TOO_LONG: `Job name must be less than ${VALIDATION_RULES.JOB_NAME.MAX_LENGTH} characters`,
    JOB_NAME_INVALID_CHARS: "Job name contains invalid characters",
    STATUS_REQUIRED: "Status is required",
    NETWORK_ERROR: "Network error occurred",
    UNKNOWN_ERROR: "An unknown error occurred",
  },
  he: {
    JOB_NAME_REQUIRED: "שם העבודה הוא שדה חובה",
    JOB_NAME_TOO_SHORT: `שם העבודה חייב להיות לפחות ${VALIDATION_RULES.JOB_NAME.MIN_LENGTH} תווים`,
    JOB_NAME_TOO_LONG: `שם העבודה חייב להיות פחות מ-${VALIDATION_RULES.JOB_NAME.MAX_LENGTH} תווים`,
    JOB_NAME_INVALID_CHARS: "שם העבודה מכיל תווים לא חוקיים",
    STATUS_REQUIRED: "חובה לבחור סטטוס",
    NETWORK_ERROR: "שגיאת רשת",
    UNKNOWN_ERROR: "שגיאה לא ידועה",
  },
} as const;

export type Language = keyof typeof ERROR_MESSAGES;
export type ErrorKey = keyof typeof ERROR_MESSAGES.en;
