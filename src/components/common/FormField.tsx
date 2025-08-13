import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";

export interface FormFieldProps {
  label: string;
  error?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
}

export interface InputFieldProps extends FormFieldProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface SelectFieldProps extends FormFieldProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Array<{ value: string | number; label: string }>;
}

/**
 * Reusable form field components
 * Reduces duplication in form creation
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  isRequired = false,
  children,
}) => {
  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      {children}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  isRequired,
  type = "text",
  value,
  onChange,
  placeholder,
  autoFocus,
}) => {
  return (
    <FormField label={label} error={error} isRequired={isRequired}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </FormField>
  );
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  error,
  isRequired,
  value,
  onChange,
  placeholder,
  options,
}) => {
  return (
    <FormField label={label} error={error} isRequired={isRequired}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormField>
  );
};
