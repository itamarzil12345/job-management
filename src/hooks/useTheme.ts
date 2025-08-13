import { useColorMode } from "@chakra-ui/react";

/**
 * Custom hook that provides theme-related utilities
 * Centralizes the common isDark pattern used across all components
 */
export const useTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return {
    colorMode,
    toggleColorMode,
    isDark,
  };
};
