import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SignalRStatus } from "./SignalRStatus";
import SystemLogs, { LogEntry } from "./SystemLogs";
import { jobService } from "../services/jobService";
import { loggingService } from "../services/loggingService";
import { Job, JobProgressUpdate } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { CreateJobModal } from "./CreateJobModal";
import { DeleteJobsModal } from "./DeleteJobsModal";
import { JobTable } from "./JobTable";
import { StatusCards } from "./StatusCards";

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
  const [logsPanelWidth, setLogsPanelWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

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

    const handleMouseDown = () => {
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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

  const getStatusCounts = () => {
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    jobs.forEach((job) => {
      counts[job.status as keyof typeof counts]++;
    });
    return counts;
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        Loading...
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10} color="red.500">
        Error: {error}
      </Box>
    );
  }

  return (
    <Box position="relative" h="100vh" p={4}>
      <Box position="relative" h="100%" display="flex">
        {/* Main Content */}
        <Box flex={1} pr={2} minW="400px" overflow="auto">
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <HStack spacing={4}>
                <Button colorScheme="blue" onClick={onCreateOpen} size="lg">
                  {language === "he" ? "צור עבודה חדשה" : "Create New Job"}
                </Button>
                <Button colorScheme="red" onClick={onDeleteOpen} size="lg">
                  {language === "he" ? "מחק עבודות" : "Delete Jobs"}
                </Button>
              </HStack>
            </HStack>

            <StatusCards counts={getStatusCounts()} />

            {/* SignalR Status - Only show when not using mock data */}
            {!USE_MOCK_DATA && (
              <SignalRStatus
                isConnected={signalRStatus.isConnected}
                connectionState={signalRStatus.connectionState}
                hubUrl={signalRStatus.connectionInfo.hubUrl}
              />
            )}

            <JobTable
              jobs={jobs}
              onJobAction={handleJobAction}
              onRefresh={fetchJobs}
            />

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

        {/* Resize Handle */}
        <Box
          ref={resizeRef}
          w="8px"
          bg={isResizing ? "blue.500" : "gray.200"}
          cursor="col-resize"
          _hover={{ bg: "blue.300" }}
          _active={{ bg: "blue.500" }}
          onMouseDown={() => {
            setIsResizing(true);
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
          transition="background-color 0.2s"
          _after={{
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            w: "2px",
            h: "40px",
            bg: isResizing ? "white" : "gray.400",
            borderRadius: "1px",
            opacity: isResizing ? 0.9 : 0.6,
          }}
          _before={{
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            w: "1px",
            h: "20px",
            bg: isResizing ? "white" : "gray.500",
            borderRadius: "0.5px",
            opacity: isResizing ? 1 : 0.8,
          }}
        />

        {/* System Logs Panel - Right Side */}
        <Box
          w={`${logsPanelWidth}px`}
          minW="300px"
          h="100%"
          position="relative"
          borderLeft="1px solid"
          borderColor="gray.200"
        >
          <SystemLogs logs={logs} maxLogs={200} />
        </Box>
      </Box>
    </Box>
  );
};
