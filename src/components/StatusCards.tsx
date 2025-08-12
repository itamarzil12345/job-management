import React from "react";
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";

interface StatusCardsProps {
  counts: Record<number, number>;
}

const getStatusConfig = (status: JobStatus, language: string) => {
  const configs = {
    [JobStatus.Pending]: {
      label: language === "he" ? "ממתין" : "Pending",
      color: "blue",
      icon: "⏳",
    },
    [JobStatus.InQueue]: {
      label: language === "he" ? "בתור" : "In Queue",
      color: "yellow",
      icon: "📋",
    },
    [JobStatus.Running]: {
      label: language === "he" ? "רץ" : "Running",
      color: "green",
      icon: "▶️",
    },
    [JobStatus.Completed]: {
      label: language === "he" ? "הושלם" : "Completed",
      color: "teal",
      icon: "✅",
    },
    [JobStatus.Failed]: {
      label: language === "he" ? "נכשל" : "Failed",
      color: "red",
      icon: "❌",
    },
    [JobStatus.Stopped]: {
      label: language === "he" ? "עצר" : "Stopped",
      color: "gray",
      icon: "⏹️",
    },
  };
  return configs[status];
};

export const StatusCards: React.FC<StatusCardsProps> = ({ counts }) => {
  const { language } = useLanguage();

  return (
    <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
      {[JobStatus.Pending, JobStatus.InQueue, JobStatus.Running, JobStatus.Completed, JobStatus.Failed, JobStatus.Stopped].map((status) => {
        const config = getStatusConfig(status, language);
        return (
          <Box
            key={status}
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="md"
            borderLeft={`4px solid var(--chakra-colors-${config.color}-500)`}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                {config.icon} {config.label}
              </StatLabel>
              <StatNumber
                fontSize="2xl"
                fontWeight="bold"
                color={`${config.color}.600`}
              >
                {counts[status as keyof typeof counts] || 0}
              </StatNumber>
              <StatHelpText fontSize="xs" color="gray.500">
                {language === "he" ? "עבודות" : "Jobs"}
              </StatHelpText>
            </Stat>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};
