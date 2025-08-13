import React from "react";
import {
  ChakraProvider,
  Box,
  Container,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { JobDashboard } from "./components/JobDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";
import { getBackgroundColor, getTextColor, getAdditionalColor } from "./theme";

function App() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <ChakraProvider>
      <LanguageProvider>
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
                    : "blue.600"
                }
                textShadow={isDark ? "0 0 10px rgba(0, 255, 65, 0.3)" : "none"}
              >
                Job Dashboard
              </Text>
            </Box>
            <JobDashboard />
          </Container>
        </Box>
      </LanguageProvider>
    </ChakraProvider>
  );
}

export default App;
