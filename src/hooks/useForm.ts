import { useState, useCallback, useRef } from "react";

export interface FormField {
  value: any;
  error?: string;
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => Promise<void> | void;
  onError?: (error: Error) => void;
}

/**
 * Enhanced reusable form hook with better error handling and performance
 * Includes touch tracking and improved validation
 */
export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  onError,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const mountedRef = useRef(true);

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      if (!mountedRef.current) return;

      setValues((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const validateField = useCallback(
    (field: keyof T) => {
      if (!validate) return true;

      const allErrors = validate(values);
      const fieldError = allErrors[field];

      setErrors((prev) => ({ ...prev, [field]: fieldError }));

      return !fieldError;
    },
    [values, validate]
  );

  const handleSubmit = useCallback(async () => {
    if (!mountedRef.current || !onSubmit) return;

    setSubmitCount((prev) => prev + 1);

    // Mark all fields as touched on submit
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      onError?.(err);
      throw err;
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit, onError]);

  const reset = useCallback(() => {
    if (!mountedRef.current) return;

    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    mountedRef.current = false;
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    setValue,
    setFieldTouched,
    validateForm,
    validateField,
    handleSubmit,
    reset,
    cleanup,
  };
};
