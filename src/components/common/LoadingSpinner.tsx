import React from "react";
import {
  Spinner,
  VStack,
  Text,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { useTheme } from "../../hooks/useTheme";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  progress?: number;
  variant?: "spinner" | "circular";
  fullScreen?: boolean;
}

/**
 * Reusable loading spinner component with accessibility and better UX
 * Supports different variants, progress indication, and screen reader support
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
  progress,
  variant = "spinner",
  fullScreen = false,
}) => {
  const { isDark } = useTheme();

  const sizeMap = {
    sm: "32px",
    md: "48px",
    lg: "64px",
    xl: "80px",
  };

  const Component = fullScreen ? Center : VStack;
  const containerProps = fullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: isDark ? "blackAlpha.700" : "whiteAlpha.700",
        zIndex: 9999,
      }
    : { spacing: 4, py: 8 };

  return (
    <Component {...containerProps}>
      <VStack spacing={4}>
        {variant === "circular" && progress !== undefined ? (
          <CircularProgress
            value={progress}
            size={sizeMap[size]}
            color={isDark ? "purple.400" : "blue.400"}
            trackColor={isDark ? "gray.700" : "gray.200"}
          >
            <CircularProgressLabel fontSize="sm" fontWeight="bold">
              {Math.round(progress)}%
            </CircularProgressLabel>
          </CircularProgress>
        ) : (
          <Spinner
            size={size}
            color={isDark ? "purple.400" : "blue.400"}
            thickness="4px"
            speed="0.65s"
            emptyColor={isDark ? "gray.700" : "gray.200"}
          />
        )}

        <Text
          fontSize="sm"
          color={isDark ? "gray.300" : "gray.600"}
          textAlign="center"
          role="status"
          aria-live="polite"
        >
          {message}
        </Text>
      </VStack>
    </Component>
  );
};
