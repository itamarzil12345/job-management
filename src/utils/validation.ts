import {
  VALIDATION_RULES,
  ERROR_MESSAGES,
  Language,
  ErrorKey,
} from "../constants/validation";

/**
 * Validation utility functions with internationalization support
 * Centralized validation logic for better maintainability
 */

export interface ValidationResult {
  isValid: boolean;
  errorKey?: ErrorKey;
}

export const validateJobName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, errorKey: "JOB_NAME_REQUIRED" };
  }

  if (name.trim().length < VALIDATION_RULES.JOB_NAME.MIN_LENGTH) {
    return { isValid: false, errorKey: "JOB_NAME_TOO_SHORT" };
  }

  if (name.trim().length > VALIDATION_RULES.JOB_NAME.MAX_LENGTH) {
    return { isValid: false, errorKey: "JOB_NAME_TOO_LONG" };
  }

  if (!VALIDATION_RULES.JOB_NAME.PATTERN.test(name.trim())) {
    return { isValid: false, errorKey: "JOB_NAME_INVALID_CHARS" };
  }

  return { isValid: true };
};

export const validateStatus = (status: string | number): ValidationResult => {
  if (status === "" || status === null || status === undefined) {
    return { isValid: false, errorKey: "STATUS_REQUIRED" };
  }

  return { isValid: true };
};

export const getErrorMessage = (
  errorKey: ErrorKey,
  language: Language
): string => {
  return ERROR_MESSAGES[language][errorKey];
};

export const validatePanelWidth = (
  width: number,
  windowWidth: number
): { isValid: boolean; clampedWidth: number } => {
  const minWidth = VALIDATION_RULES.PANEL_WIDTH.MIN;
  const maxWidth = windowWidth * VALIDATION_RULES.PANEL_WIDTH.MAX_PERCENTAGE;

  const clampedWidth = Math.min(Math.max(width, minWidth), maxWidth);

  return {
    isValid: width >= minWidth && width <= maxWidth,
    clampedWidth,
  };
};
