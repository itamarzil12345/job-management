import React from "react";
import {
  Box,
  Badge,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getBackgroundColor,
  getTextColor,
  getBorderColor,
  getAdditionalColor,
  getGrayColor,
} from "../theme";

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

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
      bg={
        isDark
          ? getBackgroundColor(isDark)
          : getAdditionalColor("white", isDark)
      }
      borderRadius="md"
      boxShadow={isDark ? "0 0 20px rgba(138, 43, 226, 0.1)" : "sm"}
      border="1px solid"
      borderColor={
        isDark ? getBorderColor(isDark) : getGrayColor("200", isDark)
      }
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
            color={isDark ? getTextColor(isDark) : getGrayColor("700", isDark)}
          >
            {language === "he" ? "סטטוס SignalR" : "SignalR Status"}
          </Text>
          <HStack spacing={2} align="center">
            <Badge colorScheme={getStatusColor()} size="sm">
              {getStatusText()}
            </Badge>
            <Text
              fontSize="xs"
              color={
                isDark
                  ? getAdditionalColor("deepSkyBlue", isDark)
                  : getGrayColor("500", isDark)
              }
            >
              {hubUrl}
            </Text>
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
