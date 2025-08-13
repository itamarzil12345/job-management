import React from "react";
import {
  SimpleGrid,
  Box,
  VStack,
  Text,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getCardBackgroundColor,
  getTextColor,
  getBorderColor,
  getAdditionalColor,
} from "../theme";

interface StatusCardsProps {
  counts: Record<number, number>;
}

const getStatusConfig = (
  status: JobStatus,
  language: string,
  isDark: boolean
) => {
  const configs = {
    [JobStatus.Pending]: {
      label: language === "he" ? "ממתין" : "Pending",
      color: "blue",
      icon: "⏳",
      bgColor: "blue.50",
      borderColor: "orange.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.InQueue]: {
      label: language === "he" ? "בתור" : "In Queue",
      color: "purple",
      icon: "📋",
      bgColor: "purple.50",
      borderColor: "purple.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightPurple", true),
    },
    [JobStatus.Running]: {
      label: language === "he" ? "רץ" : "Running",
      color: "blue",
      icon: "▶️",
      bgColor: "blue.50",
      borderColor: "blue.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Completed]: {
      label: language === "he" ? "הושלם" : "Completed",
      color: "green",
      icon: "✅",
      bgColor: "green.50",
      borderColor: "green.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightGreenLight", true),
    },
    [JobStatus.Failed]: {
      label: language === "he" ? "נכשל" : "Failed",
      color: "red",
      icon: "❌",
      bgColor: "red.50",
      borderColor: "red.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Stopped]: {
      label: language === "he" ? "עצר" : "Stopped",
      color: "gray",
      icon: "⏹️",
      bgColor: "gray.50",
      borderColor: "gray.400",
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightPurple", true),
    },
  };
  return configs[status];
};

export const StatusCards: React.FC<StatusCardsProps> = ({ counts }) => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
      {[
        JobStatus.Pending,
        JobStatus.InQueue,
        JobStatus.Running,
        JobStatus.Completed,
        JobStatus.Failed,
        JobStatus.Stopped,
      ].map((status) => {
        const config = getStatusConfig(status, language, isDark);
        return (
          <Box
            key={status}
            bg={isDark ? config.darkBgColor : "white"}
            p={6}
            borderRadius="lg"
            borderTop="6px solid"
            borderTopColor={isDark ? config.darkTextColor : config.borderColor}
            boxShadow={isDark ? "0 0 20px rgba(138, 43, 226, 0.1)" : "md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: isDark ? "0 0 25px rgba(138, 43, 226, 0.2)" : "lg",
            }}
            transition="all 0.2s"
            textAlign="center"
          >
            <VStack spacing={2}>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={isDark ? config.darkTextColor : `${config.color}.600`}
              >
                {counts[status as keyof typeof counts] || 0}
              </Text>
              <Text
                fontSize="sm"
                color={
                  isDark
                    ? getAdditionalColor("brightPurple", isDark)
                    : "gray.600"
                }
                fontWeight="medium"
              >
                {config.label}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};
