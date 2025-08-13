import React from "react";
import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
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
  t: (key: string) => string,
  isDark: boolean
) => {
  const configs = {
    [JobStatus.Pending]: {
      label: t("jobStatus.pending"),
      color: "blue",
      icon: "⏳",
      bgColor: getBlueColor("50", isDark),
      borderColor: getOrangeColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.InQueue]: {
      label: t("jobStatus.inQueue"),
      color: "purple",
      icon: "📋",
      bgColor: getPurpleColor("50", isDark),
      borderColor: getPurpleColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightPurple", true),
    },
    [JobStatus.Running]: {
      label: t("jobStatus.running"),
      color: "blue",
      icon: "▶️",
      bgColor: getBlueColor("50", isDark),
      borderColor: getBlueColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Completed]: {
      label: t("jobStatus.completed"),
      color: "green",
      icon: "✅",
      bgColor: getGreenColor("50", isDark),
      borderColor: getGreenColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("brightGreenLight", true),
    },
    [JobStatus.Failed]: {
      label: t("jobStatus.failed"),
      color: "red",
      icon: "❌",
      bgColor: getRedColor("50", isDark),
      borderColor: getRedColor("400", isDark),
      darkBgColor: getCardBackgroundColor(true),
      darkTextColor: getAdditionalColor("deepSkyBlue", true),
    },
    [JobStatus.Stopped]: {
      label: t("jobStatus.stopped"),
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
  const { t } = useI18n();
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
        const config = getStatusConfig(status, t, isDark);
        return (
          <Box
            key={status}
            bg={
              isDark ? config.darkBgColor : getAdditionalColor("white", isDark)
            }
            p={6}
            borderRadius="lg"
            borderTop="6px solid"
            borderTopColor={config.borderColor}
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
