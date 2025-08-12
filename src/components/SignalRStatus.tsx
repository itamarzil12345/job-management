import React, { useState, useEffect } from "react";
import {
  Box,
  Badge,
  Text,
  HStack,
  Icon,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { useLanguage } from "../contexts/LanguageContext";
import { JobProgressUpdate } from "../types/job";

interface JobUpdateWithTimestamp extends JobProgressUpdate {
  timestamp: Date;
}

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
  const [latestUpdates, setLatestUpdates] = useState<JobUpdateWithTimestamp[]>(
    []
  );

  // Debug logging
  console.log("SignalR Status Props:", {
    isConnected,
    connectionState,
    hubUrl,
  });

  // Listen for job progress updates
  useEffect(() => {
    const handleJobUpdate = (update: JobProgressUpdate) => {
      const updateWithTimestamp = {
        ...update,
        timestamp: new Date(),
      };
      setLatestUpdates((prev) => {
        const newUpdates = [updateWithTimestamp, ...prev.slice(0, 4)]; // Keep last 5 updates
        return newUpdates;
      });
    };

    // Import the signalR service dynamically to avoid circular dependencies
    import("../services/signalRService").then(({ signalRService }) => {
      signalRService.onJobProgressUpdate(handleJobUpdate);
    });

    return () => {
      import("../services/signalRService").then(({ signalRService }) => {
        signalRService.offJobProgressUpdate();
      });
    };
  }, []);

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

  const getJobStatusText = (status: number) => {
    const statusMap = {
      0: language === "he" ? "ממתין" : "Pending",
      1: language === "he" ? "בתור" : "In Queue",
      2: language === "he" ? "רץ" : "Running",
      3: language === "he" ? "הושלם" : "Completed",
      4: language === "he" ? "נכשל" : "Failed",
      5: language === "he" ? "עצר" : "Stopped",
    };
    return statusMap[status as keyof typeof statusMap] || "Unknown";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={3} align="stretch">
        {/* Connection Status */}
        <HStack spacing={3} align="center">
          <Icon
            as={getStatusIcon()}
            color={`${getStatusColor()}.500`}
            boxSize={4}
          />
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              {language === "he" ? "סטטוס SignalR" : "SignalR Status"}
            </Text>
            <HStack spacing={2} align="center">
              <Badge colorScheme={getStatusColor()} size="sm">
                {getStatusText()}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {hubUrl}
              </Text>
            </HStack>
          </Box>
        </HStack>

        {/* Job Updates */}
        {isConnected && connectionState === "Connected" && (
          <>
            <Divider />
            <Box>
              <HStack justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {language === "he"
                    ? "עדכוני עבודות בזמן אמת"
                    : "Real-time Job Updates"}
                </Text>
                {latestUpdates.length > 0 && (
                  <Text fontSize="xs" color="gray.500">
                    {language === "he" ? "עדכון אחרון" : "Last update"}:{" "}
                    {formatTime(latestUpdates[0].timestamp)}
                  </Text>
                )}
              </HStack>
              {latestUpdates.length > 0 ? (
                <VStack spacing={2} align="stretch">
                  {latestUpdates.map(
                    (update: JobUpdateWithTimestamp, index) => (
                      <Box
                        key={`${update.jobID}-${index}`}
                        p={2}
                        bg="gray.50"
                        borderRadius="sm"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <HStack justify="space-between" align="center">
                          <VStack spacing={1} align="start">
                            <Text
                              fontSize="xs"
                              fontWeight="medium"
                              color="gray.600"
                            >
                              Job {update.name}
                            </Text>
                            <HStack spacing={2}>
                              <Badge colorScheme="blue" size="sm">
                                {getJobStatusText(update.status)}
                              </Badge>
                              <Badge colorScheme="green" size="sm">
                                {update.progress}%
                              </Badge>
                            </HStack>
                          </VStack>
                          <Text fontSize="xs" color="gray.500">
                            {formatTime(update.timestamp)}
                          </Text>
                        </HStack>
                      </Box>
                    )
                  )}
                </VStack>
              ) : (
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {language === "he"
                    ? "ממתין לעדכונים..."
                    : "Waiting for updates..."}
                </Text>
              )}
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};
