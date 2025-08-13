import React from "react";
import { ChakraProvider, Box, Container, Text } from "@chakra-ui/react";
import { useTheme } from "./hooks/useTheme";
import { JobDashboard } from "./components/JobDashboard";
import "./i18n"; // Initialize i18n
import {
  getBackgroundColor,
  getTextColor,
  getAdditionalColor,
  getBlueColor,
} from "./theme";

function App() {
  const { isDark } = useTheme();

  return (
    <ChakraProvider>
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
    </ChakraProvider>
  );
}

export default App;
