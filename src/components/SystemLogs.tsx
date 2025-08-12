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
  const bgColor = useColorModeValue("#f8f9fa", "#000000"); // Light gray / Pure black
  const textColor = useColorModeValue("#006400", "#00ff41"); // Dark green / Bright green
  const borderColor = useColorModeValue("#006400", "#00ff41"); // Dark green / Bright green
  const accentColor = useColorModeValue("#8b008b", "#ff0080"); // Dark magenta / Bright magenta
  const warningColor = useColorModeValue("#ff8c00", "#ffaa00"); // Dark orange / Bright orange
  const errorColor = useColorModeValue("#dc143c", "#ff0040"); // Crimson red / Bright red
  const successColor = useColorModeValue("#228b22", "#00ff00"); // Forest green / Bright green

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
        return accentColor; // Dark magenta
      case "nodejs":
        return "#4169e1"; // Royal blue
      case "dotnet":
        return successColor; // Forest green
      default:
        return "#696969"; // Dim gray
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
      fontSize="10px"
      display="flex"
      flexDirection="column"
      position="relative"
      border="1px solid"
      borderColor={borderColor}
      css={{
        "& *": {
          fontSize: "10px !important",
        },
        "& .log-timestamp": {
          fontSize: "9px !important",
        },
        "& .log-message": {
          fontSize: "9px !important",
        },
        "& .log-header": {
          fontSize: "11px !important",
        },
        "& .log-time": {
          fontSize: "9px !important",
        },
        "@keyframes scan": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: useColorModeValue(
          "linear-gradient(45deg, transparent 49%, rgba(0, 100, 0, 0.05) 50%, transparent 51%)",
          "linear-gradient(45deg, transparent 49%, rgba(0, 255, 65, 0.08) 50%, transparent 51%)"
        ),
        backgroundSize: "20px 20px",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <Flex
        mb={2}
        alignItems="center"
        gap={2}
        p={2}
        pb={1}
        borderBottom="2px solid"
        borderColor={borderColor}
        position="relative"
        zIndex={2}
        bg={useColorModeValue("white", "rgba(0, 0, 0, 0.8)")}
        _dark={{
          bg: "rgba(0, 0, 0, 0.8)",
          borderColor: "#00ff41",
          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)",
        }}
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-2px",
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${borderColor}, ${accentColor}, ${borderColor})`,
          animation: "scan 2s linear infinite",
        }}
      >
        <Box as={FaCircle as any} color={errorColor} boxSize={2} />
        <Box as={FaCircle as any} color={warningColor} boxSize={2} />
        <Box as={FaCircle as any} color={successColor} boxSize={2} />
        <Text
          color={textColor}
          ml={2}
          fontWeight="bold"
          fontSize="11px"
          className="log-header"
          textShadow={useColorModeValue(
            "0 0 5px rgba(0, 100, 0, 0.3)",
            "0 0 8px rgba(0, 255, 65, 0.6)"
          )}
          _dark={{
            textShadow: "0 0 8px rgba(0, 255, 65, 0.6)",
            letterSpacing: "0.1em",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {useColorModeValue(
            "[SYSTEM] TERMINAL_ACCESS_GRANTED",
            "[SYSTEM] TERMINAL_ACCESS_GRANTED"
          )}
        </Text>
        <Text
          color={accentColor}
          ml="auto"
          fontSize="9px"
          fontFamily="mono"
          fontWeight="bold"
          className="log-time"
        >
          {new Date().toLocaleTimeString()}
        </Text>
      </Flex>

      <Box
        flex={1}
        overflowY="auto"
        px={2}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: useColorModeValue("gray.600", "gray.500"),
            borderRadius: "3px",
          },
        }}
      >
        <VStack spacing={1} align="stretch">
          {displayLogs.map((log) => (
            <Flex
              key={log.id}
              alignItems="flex-start"
              gap={2}
              p={1}
              _hover={{ bg: "rgba(0, 100, 0, 0.05)" }}
            >
              <Text
                color="#666"
                fontSize="9px"
                minW="70px"
                fontFamily="mono"
                fontWeight="bold"
                className="log-timestamp"
              >
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
              <Text
                color={textColor}
                flex={1}
                fontFamily="mono"
                fontSize="9px"
                className="log-message"
              >
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
