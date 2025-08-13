import React, { useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Container,
  Text,
  extendTheme,
} from "@chakra-ui/react";
import { useTheme } from "./hooks/useTheme";
import { JobDashboard } from "./components/JobDashboard";
import "./i18n"; // Initialize i18n
import { getBackgroundColor, getTextColor, getBlueColor } from "./theme";

// Configure Chakra UI theme with proper color mode support
const chakraTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "#0d1117" : "#ffffff",
        color: props.colorMode === "dark" ? "#f0f6fc" : "#2d3748",
      },
      // Ensure all text elements inherit proper colors
      "p, div, span, h1, h2, h3, h4, h5, h6": {
        color: props.colorMode === "dark" ? "#f0f6fc" : "#2d3748",
      },
      // Secondary text elements
      ".chakra-text": {
        color: props.colorMode === "dark" ? "#8b949e" : "#4a5568",
      },
      // Input and form elements
      "input, select, textarea": {
        bg: props.colorMode === "dark" ? "#21262d" : "#ffffff",
        color: props.colorMode === "dark" ? "#f0f6fc" : "#2d3748",
        borderColor: props.colorMode === "dark" ? "#30363d" : "#e2e8f0",
      },
      // Button text
      button: {
        color: props.colorMode === "dark" ? "#f0f6fc" : "#2d3748",
      },
    }),
  },
  colors: {
    gray: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
  },
});

// Inner component that uses the theme hook (must be inside ChakraProvider)
const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  // Update body background when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = getBackgroundColor(isDark);
    document.documentElement.style.backgroundColor = getBackgroundColor(isDark);
  }, [isDark]);

  return (
    <Box
      bg={getBackgroundColor(isDark)}
      minH="100vh"
      color={getTextColor(isDark)}
    >
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" mb={8}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={
              isDark
                ? "#f0f6fc" // Light text for dark mode
                : getBlueColor("600", isDark)
            }
            textShadow="none"
          >
            Job Dashboard
          </Text>
        </Box>
        <JobDashboard />
      </Container>
    </Box>
  );
};

// Main App component that provides the Chakra theme
function App() {
  return (
    <ChakraProvider theme={chakraTheme}>
      <AppContent />
    </ChakraProvider>
  );
}

export default App;
