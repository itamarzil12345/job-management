import React from "react";
import { SimpleGrid, Box, VStack, Text } from "@chakra-ui/react";
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
      bgColor: "blue.50",
      borderColor: "blue.200",
    },
    [JobStatus.InQueue]: {
      label: language === "he" ? "בתור" : "In Queue",
      color: "purple",
      icon: "📋",
      bgColor: "purple.50",
      borderColor: "purple.200",
    },
    [JobStatus.Running]: {
      label: language === "he" ? "רץ" : "Running",
      color: "blue",
      icon: "▶️",
      bgColor: "blue.50",
      borderColor: "blue.200",
    },
    [JobStatus.Completed]: {
      label: language === "he" ? "הושלם" : "Completed",
      color: "green",
      icon: "✅",
      bgColor: "green.50",
      borderColor: "green.200",
    },
    [JobStatus.Failed]: {
      label: language === "he" ? "נכשל" : "Failed",
      color: "red",
      icon: "❌",
      bgColor: "red.50",
      borderColor: "red.200",
    },
    [JobStatus.Stopped]: {
      label: language === "he" ? "עצר" : "Stopped",
      color: "gray",
      icon: "⏹️",
      bgColor: "gray.50",
      borderColor: "gray.200",
    },
  };
  return configs[status];
};

export const StatusCards: React.FC<StatusCardsProps> = ({ counts }) => {
  const { language } = useLanguage();

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
        const config = getStatusConfig(status, language);
        return (
          <Box
            key={status}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            borderTop={`4px solid ${config.borderColor}`}
            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            transition="all 0.2s"
          >
            <VStack spacing={2}>
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={`${config.color}.600`}
              >
                {counts[status as keyof typeof counts] || 0}
              </Text>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {config.label}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};
