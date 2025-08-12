import React from "react";
import { ChakraProvider, Box, Container, Heading } from "@chakra-ui/react";
import { JobDashboard } from "./components/JobDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <ChakraProvider>
      <LanguageProvider>
        <Box bg="gray.50" minH="100vh" color="gray.800">
          <Container maxW="container.xl" py={8}>
            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              mb={8}
              color="blue.600"
            >
              Job Management Dashboard
            </Heading>
            <JobDashboard />
          </Container>
        </Box>
      </LanguageProvider>
    </ChakraProvider>
  );
}

export default App;
