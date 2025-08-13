import React from "react";
import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../hooks/useTheme";
import { getStatusLabel } from "../utils/statusLabels";
import {
  getCardBackgroundColor,
  getAdditionalColor,
  getGrayColor,
  getBlueColor,
  getRedColor,
  getGreenColor,
  getPurpleColor,
  getOrangeColor,
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
      label: getStatusLabel(JobStatus.Pending, language === "he" ? "he" : "en"),
      color: "blue",
      icon: "⏳",
      bgColor: getBlueColor("50", isDark),
      borderColor: getOrangeColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.InQueue]: {
      label: getStatusLabel(JobStatus.InQueue, language === "he" ? "he" : "en"),
      color: "purple",
      icon: "📋",
      bgColor: getPurpleColor("50", isDark),
      borderColor: getPurpleColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightPurple", true),
    },
    [JobStatus.Running]: {
      label: getStatusLabel(JobStatus.Running, language === "he" ? "he" : "en"),
      color: "blue",
      icon: "▶️",
      bgColor: getBlueColor("50", isDark),
      borderColor: getBlueColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Completed]: {
      label: getStatusLabel(
        JobStatus.Completed,
        language === "he" ? "he" : "en"
      ),
      color: "green",
      icon: "✅",
      bgColor: getGreenColor("50", isDark),
      borderColor: getGreenColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightGreenLight", true),
    },
    [JobStatus.Failed]: {
      label: getStatusLabel(JobStatus.Failed, language === "he" ? "he" : "en"),
      color: "red",
      icon: "❌",
      bgColor: getRedColor("50", isDark),
      borderColor: getRedColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Stopped]: {
      label: getStatusLabel(JobStatus.Stopped, language === "he" ? "he" : "en"),
      color: "gray",
      icon: "⏹️",
      bgColor: getGrayColor("50", isDark),
      borderColor: getGrayColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightPurple", true),
    },
  };
  return configs[status];
};

export const StatusCards: React.FC<StatusCardsProps> = ({ counts }) => {
  const { language } = useLanguage();
  const { isDark } = useTheme();

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
            bg={
              isDark ? config.darkBgColor : getAdditionalColor("white", isDark)
            }
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
                    : getGrayColor("600", isDark)
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
