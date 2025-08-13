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
import {
  getBackgroundColor,
  getTextColor,
  getAdditionalColor,
  getBlueColor,
} from "./theme";

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
      },
    }),
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
                ? getAdditionalColor("brightGreen", isDark)
                : getBlueColor("600", isDark)
            }
            textShadow={
              isDark
                ? `0 0 10px ${getAdditionalColor("brightGreen", isDark)}4D`
                : "none"
            }
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
