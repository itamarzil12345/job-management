import React from "react";
import { Box, Badge, Text, HStack, Icon } from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useI18n } from "../hooks/useI18n";
import {
  getBackgroundColor,
  getTextColor,
  getBorderColor,
  getAdditionalColor,
  getGrayColor,
} from "../theme";
import { useTheme } from "../hooks/useTheme";

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
  const { t } = useI18n();
  const { isDark } = useTheme();

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
      return t("signalr.connected");
    }
    if (connectionState === "Connecting") {
      return t("signalr.connecting");
    }
    if (connectionState === "Reconnecting") {
      return t("signalr.reconnecting");
    }
    return t("signalr.disconnected");
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
            {t("signalr.status")}
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
