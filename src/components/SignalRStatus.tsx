import React from "react";
import {
  Box,
  Badge,
  Text,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useLanguage } from "../contexts/LanguageContext";

interface SignalRStatusProps {
  isConnected: boolean;
  connectionState: string;
  hubUrl: string;
}

export const SignalRStatus: React.FC<SignalRStatusProps> = ({
  isConnected,
  connectionState,
  hubUrl,
}) => {
  const { language } = useLanguage();

  const getStatusColor = () => {
    if (isConnected && connectionState === "Connected") return "green";
    if (connectionState === "Connecting" || connectionState === "Reconnecting")
      return "yellow";
    return "red";
  };

  const getStatusIcon = () => {
    if (isConnected && connectionState === "Connected") return CheckCircleIcon;
    if (connectionState === "Connecting" || connectionState === "Reconnecting")
      return WarningIcon;
    return CloseIcon;
  };

  const getStatusText = () => {
    if (isConnected && connectionState === "Connected") {
      return language === "he" ? "מחובר" : "Connected";
    }
    if (connectionState === "Connecting") {
      return language === "he" ? "מתחבר..." : "Connecting...";
    }
    if (connectionState === "Reconnecting") {
      return language === "he" ? "מתחבר מחדש..." : "Reconnecting...";
    }
    return language === "he" ? "מנותק" : "Disconnected";
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      _dark={{
        bg: "#0f0f23",
        borderColor: "#8a2be2",
        boxShadow: "0 0 20px rgba(138, 43, 226, 0.1)",
      }}
    >
      <HStack spacing={3} align="center">
        <Icon
          as={getStatusIcon()}
          color={`${getStatusColor()}.500`}
          boxSize={4}
        />
        <Box>
          <Text
            fontSize="sm"
            fontWeight="medium"
            color="gray.700"
            _dark={{
              color: "#8a2be2",
            }}
          >
            {language === "he" ? "סטטוס SignalR" : "SignalR Status"}
          </Text>
          <HStack spacing={2} align="center">
            <Badge colorScheme={getStatusColor()} size="sm">
              {getStatusText()}
            </Badge>
            <Text
              fontSize="xs"
              color="gray.500"
              _dark={{
                color: "#00bfff",
              }}
            >
              {hubUrl}
            </Text>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
