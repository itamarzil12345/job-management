import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaCircle,
  FaServer,
  FaWifi,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import { IconType } from "react-icons";

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "success" | "warning" | "error";
  message: string;
  source?: "signalr" | "nodejs" | "dotnet" | "frontend";
}

interface SystemLogsProps {
  logs: LogEntry[];
  maxLogs?: number;
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs, maxLogs = 100 }) => {
  const bgColor = useColorModeValue("gray.900", "gray.800");
  const textColor = useColorModeValue("green.300", "green.200");
  const borderColor = useColorModeValue("gray.600", "gray.700");

  const getLogIcon = (level: LogEntry["level"]): IconType => {
    switch (level) {
      case "success":
        return FaCircle;
      case "warning":
        return FaExclamationTriangle;
      case "error":
        return FaExclamationTriangle;
      default:
        return FaInfoCircle;
    }
  };

  const getLogColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "success":
        return "green.400";
      case "warning":
        return "yellow.400";
      case "error":
        return "red.400";
      default:
        return "blue.400";
    }
  };

  const getSourceIcon = (source?: LogEntry["source"]): IconType => {
    switch (source) {
      case "signalr":
        return FaWifi;
      case "nodejs":
      case "dotnet":
        return FaServer;
      default:
        return FaInfoCircle;
    }
  };

  const getSourceColor = (source?: LogEntry["source"]) => {
    switch (source) {
      case "signalr":
        return "purple.400";
      case "nodejs":
        return "blue.400";
      case "dotnet":
        return "green.400";
      default:
        return "gray.400";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const displayLogs = logs.slice(-maxLogs);

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      h="calc(100vh - 32px)"
      overflow="hidden"
      fontFamily="mono"
      fontSize="sm"
      display="flex"
      flexDirection="column"
    >
      <Flex mb={3} alignItems="center" gap={2}>
        <Box as={FaCircle as any} color="red.400" boxSize={2} />
        <Box as={FaCircle as any} color="yellow.400" boxSize={2} />
        <Box as={FaCircle as any} color="green.400" boxSize={2} />
        <Text color={textColor} ml={2} fontWeight="bold">
          System Logs
        </Text>
      </Flex>

              <Box
          flex={1}
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: useColorModeValue("gray.600", "gray.500"),
              borderRadius: "4px",
            },
          }}
        >
        <VStack spacing={1} align="stretch">
          {displayLogs.map((log) => (
            <Flex key={log.id} alignItems="flex-start" gap={2}>
              <Text color="gray.500" fontSize="xs" minW="70px">
                {formatTime(log.timestamp)}
              </Text>
              <Box
                as={getLogIcon(log.level) as any}
                color={getLogColor(log.level)}
                boxSize={2}
                mt={1}
              />
              {log.source && (
                <Box
                  as={getSourceIcon(log.source) as any}
                  color={getSourceColor(log.source)}
                  boxSize={3}
                  mt={1}
                />
              )}
              <Text color={textColor} flex={1}>
                {log.message}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default SystemLogs;
