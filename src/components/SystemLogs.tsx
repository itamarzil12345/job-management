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
  const bgColor = "#f8f9fa"; // Light gray background
  const textColor = "#006400"; // Dark green
  const borderColor = "#006400";
  const accentColor = "#8b008b"; // Dark magenta
  const warningColor = "#ff8c00"; // Dark orange
  const errorColor = "#dc143c"; // Crimson red
  const successColor = "#228b22"; // Forest green

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
        return successColor; // Forest green
      case "warning":
        return warningColor;
      case "error":
        return errorColor;
      default:
        return "#4169e1"; // Royal blue
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
        return accentColor; // Cyberpunk pink
      case "nodejs":
        return "#0080ff"; // Cyberpunk blue
      case "dotnet":
        return "#00ff41"; // Matrix green
      default:
        return "#808080"; // Gray
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
      h="100%"
      overflow="hidden"
      fontFamily="'Courier New', monospace"
      fontSize="sm"
      display="flex"
      flexDirection="column"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(45deg, transparent 49%, rgba(0, 255, 65, 0.03) 50%, transparent 51%)",
        backgroundSize: "20px 20px",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Flex 
        mb={3} 
        alignItems="center" 
        gap={2} 
        p={4} 
        pb={2}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="relative"
        zIndex={2}
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-1px",
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${borderColor}, ${accentColor}, ${borderColor})`,
          animation: "scan 2s linear infinite",
        }}
      >
        <Box as={FaCircle as any} color={errorColor} boxSize={2} />
        <Box as={FaCircle as any} color={warningColor} boxSize={2} />
        <Box as={FaCircle as any} color={textColor} boxSize={2} />
        <Text color={textColor} ml={2} fontWeight="bold" textShadow={`0 0 10px ${textColor}`}>
          [SYSTEM] TERMINAL_ACCESS_GRANTED
        </Text>
        <Text color={accentColor} ml="auto" fontSize="xs" fontFamily="mono">
          {new Date().toLocaleTimeString()}
        </Text>
      </Flex>

      <Box
        flex={1}
        overflowY="auto"
        px={4}
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
