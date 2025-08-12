import React from "react";
import { ChakraProvider, Box, Container, Text } from "@chakra-ui/react";
import { JobDashboard } from "./components/JobDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <ChakraProvider>
      <LanguageProvider>
        <Box
          bg="white"
          minH="100vh"
          color="gray.800"
          _dark={{ bg: "#0f0f23", color: "#8a2be2" }}
        >
          <Container maxW="container.xl" py={8}>
            <Box textAlign="center" mb={8}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="blue.600"
                _dark={{ color: "#00ff41" }}
                textShadow="0 0 10px rgba(0, 255, 65, 0.3)"
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
