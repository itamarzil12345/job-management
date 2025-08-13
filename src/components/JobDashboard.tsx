import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, VStack, HStack, Button, useDisclosure } from "@chakra-ui/react";
import { useTheme } from "../hooks/useTheme";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SignalRStatus } from "./SignalRStatus";
import SystemLogs, { LogEntry } from "./SystemLogs";
import TopBar from "./TopBar";
import { jobService } from "../services/jobService";
import { loggingService } from "../services/loggingService";
import { Job, JobProgressUpdate } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { CreateJobModal } from "./CreateJobModal";
import { DeleteJobsModal } from "./DeleteJobsModal";
import { JobTable } from "./JobTable";
import { StatusCards } from "./StatusCards";
import {
  getBackgroundColor,
  getCardBackgroundColor,
  getBorderColor,
  getAdditionalColor,
  getGrayColor,
  getBlueColor,
  getRedColor,
} from "../theme";

// Import the USE_MOCK_DATA constant
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === "true";

export const JobDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signalRStatus, setSignalRStatus] = useState(
    jobService.getSignalRStatus()
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsPanelWidth, setLogsPanelWidth] = useLocalStorage(
    "logsPanelWidth",
    250
  );
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { isDark } = useTheme();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    fetchJobs();
    setupRealTimeUpdates();

    // Set up callback for real-time job updates from SignalR
    jobService.setJobsUpdateCallback((updatedJobs) => {
      setJobs(updatedJobs);
    });

    // Set up logging service subscription
    const unsubscribe = loggingService.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
    });

    // Add initial log entry
    loggingService.addInfo("Job Management Dashboard started", "frontend");

    // Cleanup SignalR connection on unmount
    return () => {
      unsubscribe();
      if (!USE_MOCK_DATA) {
        jobService.cleanup();
      }
    };
  }, []);

  // Update SignalR status every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalRStatus(jobService.getSignalRStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        e.preventDefault();
        const newWidth = window.innerWidth - e.clientX - 16; // Distance from right edge (16px padding)
        const minWidth = 300;
        const maxWidth = window.innerWidth * 0.6; // Max 60% of screen width

        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setLogsPanelWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setLogsPanelWidth]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const fetchedJobs = await jobService.fetchJobs();
      setJobs(fetchedJobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Only setup mock updates when using mock data
    if (USE_MOCK_DATA) {
      jobService.startMockProgressUpdates((update: JobProgressUpdate) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.jobID === update.jobID
              ? {
                  ...job,
                  name: update.name,
                  status: update.status,
                  progress: update.progress,
                }
              : job
          )
        );
      });
    }
  };

  const handleCreateJob = async (name: string, priority: number) => {
    try {
      const newJob = await jobService.createJob({ name, priority });
      setJobs((prev) => [...prev, newJob]);
      onCreateClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    }
  };

  const handleDeleteJobsByStatus = async (status: number) => {
    try {
      await jobService.deleteJobsByStatus(status);
      setJobs((prev) => prev.filter((job) => job.status !== status));
      onDeleteClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete jobs");
    }
  };

  const handleJobAction = async (
    jobID: string,
    action: "delete" | "restart" | "stop"
  ) => {
    try {
      switch (action) {
        case "delete":
          await jobService.deleteJob(jobID);
          setJobs((prev) => prev.filter((job) => job.jobID !== jobID));
          break;
        case "restart":
          await jobService.restartJob(jobID);
          await fetchJobs(); // Refresh to get updated status
          break;
        case "stop":
          await jobService.stopJob(jobID);
          await fetchJobs(); // Refresh to get updated status
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} job`);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    jobs.forEach((job) => {
      counts[job.status as keyof typeof counts]++;
    });
    return counts;
  }, [jobs]);

  if (loading) {
    return (
      <LoadingSpinner
        fullScreen
        message={language === "he" ? "טוען..." : "Loading..."}
        size="lg"
      />
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} color={getRedColor("500", isDark)}>
        Error: {error}
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box position="relative" h="100vh" p={0}>
        {/* Top Bar */}
        <TopBar />

        {/* Main Content - Full width */}
        <Box
          h="calc(100vh - 64px)"
          overflow="auto"
          maxW="100vw"
          ml={0}
          pl={0}
          bg={isDark ? getBackgroundColor(isDark) : getGrayColor("50", isDark)}
          pt={4}
        >
          <VStack spacing={6} align="stretch" p={4} pl={0}>
            {/* Action Buttons Section */}
            <Box
              bg={
                isDark
                  ? getCardBackgroundColor(isDark)
                  : getAdditionalColor("white", isDark)
              }
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor={getGrayColor("200", isDark)}
              _dark={{
                bg: getCardBackgroundColor(isDark),
                borderColor: getBorderColor(isDark),
                boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
              }}
            >
              <HStack justify="space-between" align="center">
                <HStack spacing={3}>
                  <Button colorScheme="blue" onClick={onCreateOpen} size="sm">
                    {language === "he" ? "צור עבודה חדשה" : "Create New Job"}
                  </Button>
                  <Button colorScheme="red" onClick={onDeleteOpen} size="sm">
                    {language === "he" ? "מחק עבודות" : "Delete Jobs"}
                  </Button>
                </HStack>
                <LanguageSwitcher />
              </HStack>
            </Box>

            {/* Status Cards Section */}
            <Box
              bg={
                isDark
                  ? getCardBackgroundColor(isDark)
                  : getAdditionalColor("white", isDark)
              }
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor={getGrayColor("200", isDark)}
              _dark={{
                bg: getCardBackgroundColor(isDark),
                borderColor: getBorderColor(isDark),
                boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
              }}
            >
              <StatusCards counts={statusCounts} />
            </Box>

            {/* SignalR Status Section - Only show when not using mock data */}
            {!USE_MOCK_DATA && (
              <Box
                bg={
                  isDark
                    ? getCardBackgroundColor(isDark)
                    : getAdditionalColor("white", isDark)
                }
                p={4}
                borderRadius="lg"
                boxShadow="sm"
                border="1px solid"
                borderColor={getGrayColor("200", isDark)}
                _dark={{
                  bg: getCardBackgroundColor(isDark),
                  borderColor: getBorderColor(isDark),
                  boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
                }}
              >
                <SignalRStatus
                  isConnected={signalRStatus.isConnected}
                  connectionState={signalRStatus.connectionState}
                  hubUrl={signalRStatus.connectionInfo.hubUrl}
                />
              </Box>
            )}

            {/* Job Table Section */}
            <Box
              bg={
                isDark
                  ? getCardBackgroundColor(isDark)
                  : getAdditionalColor("white", isDark)
              }
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px solid"
              borderColor={getGrayColor("200", isDark)}
              _dark={{
                bg: getCardBackgroundColor(isDark),
                borderColor: getBorderColor(isDark),
                boxShadow: "0 0 20px rgba(138, 43, 226, 0.2)",
              }}
            >
              <JobTable
                jobs={jobs}
                onJobAction={handleJobAction}
                onRefresh={fetchJobs}
              />
            </Box>

            <CreateJobModal
              isOpen={isCreateOpen}
              onClose={onCreateClose}
              onCreateJob={handleCreateJob}
            />

            <DeleteJobsModal
              isOpen={isDeleteOpen}
              onClose={onDeleteClose}
              onDeleteJobs={handleDeleteJobsByStatus}
            />
          </VStack>
        </Box>

        {/* Fixed System Logs Panel - Right Edge */}
        <Box
          position="fixed"
          top="49px"
          right="0px"
          w={`${logsPanelWidth}px`}
          minW="300px"
          h="calc(100vh - 64px)"
          borderLeft="1px solid"
          borderColor={getGrayColor("200", isDark)}
          overflow="hidden"
          zIndex={1000}
          bg={getAdditionalColor("white", isDark)}
          _dark={{
            bg: getCardBackgroundColor(isDark),
            borderColor: getBorderColor(isDark),
            boxShadow: "0 0 30px rgba(138, 43, 226, 0.3)",
          }}
          boxShadow="lg"
        >
          {/* Resize Handle - Left side of the panel */}
          <Box
            ref={resizeRef}
            position="absolute"
            left="-6px"
            top="0"
            bottom="0"
            w="12px"
            bg={
              isResizing
                ? getBlueColor("500", isDark)
                : getGrayColor("300", isDark)
            }
            cursor="col-resize"
            _hover={{
              bg: getBlueColor("400", isDark),
              boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
            }}
            _active={{
              bg: getBlueColor("600", isDark),
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.7)",
            }}
            _dark={{
              bg: isResizing
                ? getBorderColor(isDark)
                : getCardBackgroundColor(isDark),
              _hover: {
                bg: getBorderColor(isDark),
                boxShadow: "0 0 15px rgba(138, 43, 226, 0.6)",
              },
              _active: {
                bg: getBorderColor(isDark),
                boxShadow: "0 0 20px rgba(138, 43, 226, 0.8)",
              },
            }}
            onMouseDown={() => {
              setIsResizing(true);
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
            transition="all 0.2s ease"
            zIndex={1001}
            _after={{
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              w: "3px",
              h: "60px",
              bg: isResizing
                ? getAdditionalColor("white", isDark)
                : getGrayColor("500", isDark),
              borderRadius: "2px",
              opacity: isResizing ? 1 : 0.8,
              _dark: {
                bg: isResizing
                  ? getAdditionalColor("white", isDark)
                  : getAdditionalColor("brightPurple", isDark),
                opacity: isResizing ? 1 : 0.6,
              },
            }}
            _before={{
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              w: "1px",
              h: "30px",
              bg: isResizing
                ? getAdditionalColor("white", isDark)
                : getGrayColor("600", isDark),
              borderRadius: "1px",
              opacity: isResizing ? 1 : 0.9,
              _dark: {
                bg: isResizing
                  ? getAdditionalColor("white", isDark)
                  : getAdditionalColor("brightPurple", isDark),
                opacity: isResizing ? 1 : 0.8,
              },
            }}
          />

          <SystemLogs logs={logs} maxLogs={200} />
        </Box>
      </Box>
    </ErrorBoundary>
  );
};
