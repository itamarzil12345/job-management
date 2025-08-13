import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides better user experience and prevents app crashes
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });

    // Log error to external service in production
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={8} maxW="lg" mx="auto" mt={8}>
          <Alert
            status="error"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Something went wrong!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              <VStack spacing={4}>
                <Text>
                  We apologize for the inconvenience. An unexpected error
                  occurred.
                </Text>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <Box
                    as="pre"
                    p={4}
                    bg="gray.100"
                    borderRadius="md"
                    fontSize="sm"
                    overflow="auto"
                    maxH="200px"
                    w="full"
                    textAlign="left"
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Box>
                )}
                <Button colorScheme="red" onClick={this.handleReset}>
                  Try Again
                </Button>
              </VStack>
            </AlertDescription>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}
