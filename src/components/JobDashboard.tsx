import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Button, useDisclosure } from "@chakra-ui/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SignalRStatus } from "./SignalRStatus";
import { jobService } from "../services/jobService";
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

    // Cleanup SignalR connection on unmount
    return () => {
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
              ? { ...job, name: update.name, status: update.status, progress: update.progress }
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
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between" align="center">
        <HStack spacing={4}>
          <Button colorScheme="blue" onClick={onCreateOpen} size="lg">
            {language === "he" ? "צור עבודה חדשה" : "Create New Job"}
          </Button>
          <Button colorScheme="red" onClick={onDeleteOpen} size="lg">
            {language === "he" ? "מחק עבודות" : "Delete Jobs"}
          </Button>
        </HStack>
        <LanguageSwitcher />
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
  );
};
