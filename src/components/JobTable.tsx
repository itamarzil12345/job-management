import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Input,
  Select,
  VStack,
  Text,
  Progress,
  Badge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorMode,
} from "@chakra-ui/react";
import { useRef } from "react";

import { Job, JobStatus, JobPriority } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getBackgroundColor,
  getCardBackgroundColor,
  getAdditionalColor,
  getGrayColor,
  getBlueColor,
} from "../theme";

interface JobTableProps {
  jobs: Job[];
  onJobAction: (jobID: string, action: "delete" | "restart" | "stop") => void;
  onRefresh: () => void;
}

export const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onJobAction,
  onRefresh,
}) => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sortBy: "createdAt" as keyof Job,
    sortDirection: "desc" as "asc" | "desc",
  });

  const [actionJob, setActionJob] = useState<{
    id: string;
    action: string;
  } | null>(null);
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    // Filter by status
    if (filters.status !== "") {
      filtered = filtered.filter(
        (job) => job.status === parseInt(filters.status)
      );
    }

    // Filter by search
    if (filters.search) {
      filtered = filtered.filter((job) =>
        job.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return filters.sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [jobs, filters]);

  const handleSort = (column: keyof Job) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection:
        prev.sortBy === column && prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  const handleJobAction = (jobID: string, action: string) => {
    setActionJob({ id: jobID, action });
    onAlertOpen();
  };

  const confirmAction = () => {
    if (actionJob) {
      onJobAction(
        actionJob.id,
        actionJob.action as "delete" | "restart" | "stop"
      );
      onAlertClose();
      setActionJob(null);
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    const statusConfig: Record<JobStatus, { color: string; text: string }> = {
      [JobStatus.Pending]: {
        color: "blue",
        text: language === "he" ? "ממתין" : "Pending",
      },
      [JobStatus.InQueue]: {
        color: "purple",
        text: language === "he" ? "בתור" : "In Queue",
      },
      [JobStatus.Running]: {
        color: "blue",
        text: language === "he" ? "רץ" : "Running",
      },
      [JobStatus.Completed]: {
        color: "green",
        text: language === "he" ? "הושלם" : "Completed",
      },
      [JobStatus.Failed]: {
        color: "red",
        text: language === "he" ? "נכשל" : "Failed",
      },
      [JobStatus.Stopped]: {
        color: "gray",
        text: language === "he" ? "עצר" : "Stopped",
      },
    };

    const config = statusConfig[status];
    if (!config) {
      console.warn(`Unknown status: ${status}`);
      return <Badge colorScheme="gray">Unknown</Badge>;
    }
    return <Badge colorScheme={config.color}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority: JobPriority) => {
    const priorityConfig: Record<JobPriority, { color: string; text: string }> =
      {
        [JobPriority.Regular]: {
          color: "blue",
          text: language === "he" ? "רגיל" : "Regular",
        },
        [JobPriority.High]: {
          color: "red",
          text: language === "he" ? "גבוה" : "High",
        },
      };

    const config = priorityConfig[priority];
    if (!config) {
      console.warn(`Unknown priority: ${priority}`);
      return <Badge colorScheme="gray">Unknown</Badge>;
    }
    return <Badge colorScheme={config.color}>{config.text}</Badge>;
  };

  const formatTimestamp = (timestamp: number) => {
    if (timestamp === 0) return "-";
    return new Date(timestamp).toLocaleString();
  };

  const canDelete = (status: JobStatus) =>
    [JobStatus.Completed, JobStatus.Failed, JobStatus.Stopped].includes(status);
  const canRestart = (status: JobStatus) =>
    [JobStatus.Failed, JobStatus.Stopped].includes(status);
  const canStop = (status: JobStatus) =>
    [JobStatus.InQueue, JobStatus.Running].includes(status);

  if (jobs.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color={getGrayColor("500", isDark)}>
          {language === "he" ? "אין עבודות זמינות" : "No jobs available"}
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* Filters - Always visible */}
      <HStack spacing={4}>
        <Input
          placeholder={
            language === "he" ? "חיפוש לפי שם..." : "Search by name..."
          }
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          maxW="300px"
        />
        <Select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          maxW="200px"
        >
          <option value="">
            {language === "he" ? "כל הסטטוסים" : "All Statuses"}
          </option>
          {[
            JobStatus.Pending,
            JobStatus.InQueue,
            JobStatus.Running,
            JobStatus.Completed,
            JobStatus.Failed,
            JobStatus.Stopped,
          ].map((status) => (
            <option key={status} value={status}>
              {getStatusBadge(status).props.children}
            </option>
          ))}
        </Select>
        <Button onClick={onRefresh} size="sm">
          {language === "he" ? "רענן" : "Refresh"}
        </Button>
      </HStack>

      {/* No Results Message */}
      {filteredAndSortedJobs.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg" color={getGrayColor("500", isDark)}>
            {language === "he"
              ? "לא נמצאו תוצאות לסינון הנוכחי"
              : "No results found for current filters"}
          </Text>
          <Button
            mt={4}
            onClick={() =>
              setFilters({
                status: "",
                search: "",
                sortBy: "createdAt",
                sortDirection: "desc",
              })
            }
          >
            {language === "he" ? "נקה סינון" : "Clear Filters"}
          </Button>
        </Box>
      )}

      {/* Table - Only show when there are results */}
      {filteredAndSortedJobs.length > 0 && (
        <Box
          overflowX="auto"
          bg={
            isDark
              ? getCardBackgroundColor(isDark)
              : getAdditionalColor("white", isDark)
          }
          borderRadius="xl"
          boxShadow="lg"
          maxH="500px"
          overflowY="auto"
        >
          <Table variant="simple" size="md">
            <Thead
              bg={
                isDark
                  ? getAdditionalColor("black", isDark)
                  : getBlueColor("800", isDark)
              }
            >
              <Tr>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("name")}
                  color={getGrayColor("100", isDark)}
                >
                  {language === "he" ? "שם העבודה" : "Job Name"}
                  {filters.sortBy === "name" && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={
                        filters.sortDirection === "asc"
                          ? getBlueColor("300", isDark)
                          : getBlueColor("100", isDark)
                      }
                    >
                      {filters.sortDirection === "asc" ? "↑" : "↓"}
                    </Text>
                  )}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("priority")}
                  color={getGrayColor("100", isDark)}
                >
                  {language === "he" ? "עדיפות" : "Priority"}
                  {filters.sortBy === "priority" && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={
                        filters.sortDirection === "asc"
                          ? getBlueColor("300", isDark)
                          : getBlueColor("100", isDark)
                      }
                    >
                      {filters.sortDirection === "asc" ? "↑" : "↓"}
                    </Text>
                  )}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("status")}
                  color={getGrayColor("100", isDark)}
                >
                  {language === "he" ? "סטטוס" : "Status"}
                  {filters.sortBy === "status" && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={
                        filters.sortDirection === "asc"
                          ? getBlueColor("300", isDark)
                          : getBlueColor("100", isDark)
                      }
                    >
                      {filters.sortDirection === "asc" ? "↑" : "↓"}
                    </Text>
                  )}
                </Th>
                <Th color={getGrayColor("100", isDark)}>
                  {language === "he" ? "התקדמות" : "Progress"}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("startedAt")}
                  color={getGrayColor("100", isDark)}
                >
                  {language === "he" ? "זמן התחלה" : "Start Time"}
                  {filters.sortBy === "startedAt" && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={
                        filters.sortDirection === "asc"
                          ? getBlueColor("300", isDark)
                          : getBlueColor("100", isDark)
                      }
                    >
                      {filters.sortDirection === "asc" ? "↑" : "↓"}
                    </Text>
                  )}
                </Th>
                <Th
                  cursor="pointer"
                  onClick={() => handleSort("completedAt")}
                  color={getGrayColor("100", isDark)}
                >
                  {language === "he" ? "זמן סיום" : "End Time"}
                  {filters.sortBy === "completedAt" && (
                    <Text
                      as="span"
                      ml={2}
                      fontSize="sm"
                      color={
                        filters.sortDirection === "asc"
                          ? getBlueColor("300", isDark)
                          : getBlueColor("100", isDark)
                      }
                    >
                      {filters.sortDirection === "asc" ? "↑" : "↓"}
                    </Text>
                  )}
                </Th>
                <Th color={getGrayColor("100", isDark)}>
                  {language === "he" ? "פעולות" : "Actions"}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredAndSortedJobs.map((job, index) => (
                <Tr
                  key={job.jobID}
                  bg={
                    index % 2 === 0
                      ? isDark
                        ? getCardBackgroundColor(isDark)
                        : getGrayColor("100", isDark)
                      : isDark
                      ? getBackgroundColor(isDark)
                      : getAdditionalColor("white", isDark)
                  }
                  borderBottom="1px solid"
                  borderColor={
                    isDark
                      ? getAdditionalColor("brightPurple", isDark)
                      : getGrayColor("200", isDark)
                  }
                  _hover={{
                    bg: isDark
                      ? getAdditionalColor("mediumBluePurple", isDark)
                      : getBlueColor("100", isDark),
                  }}
                  transition="all 0.2s"
                >
                  <Td fontWeight="medium">{job.name}</Td>
                  <Td>{getPriorityBadge(job.priority)}</Td>
                  <Td>{getStatusBadge(job.status)}</Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Progress
                        value={job.progress}
                        size="sm"
                        width="100px"
                        colorScheme={
                          job.status === JobStatus.Completed
                            ? "green"
                            : job.status === JobStatus.Failed
                            ? "red"
                            : job.status === JobStatus.Stopped
                            ? "gray"
                            : "blue"
                        }
                      />
                      <Text fontSize="sm">{job.progress}%</Text>
                    </VStack>
                  </Td>
                  <Td>{formatTimestamp(job.startedAt)}</Td>
                  <Td>{formatTimestamp(job.completedAt)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      {canStop(job.status) && (
                        <Button
                          size="sm"
                          colorScheme="orange"
                          onClick={() => handleJobAction(job.jobID, "stop")}
                        >
                          {language === "he" ? "עצור" : "Stop"}
                        </Button>
                      )}
                      {canRestart(job.status) && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleJobAction(job.jobID, "restart")}
                        >
                          {language === "he" ? "התחל מחדש" : "Restart"}
                        </Button>
                      )}
                      {canDelete(job.status) && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleJobAction(job.jobID, "delete")}
                        >
                          {language === "he" ? "מחק" : "Delete"}
                        </Button>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Action Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              {language === "he" ? "אישור פעולה" : "Confirm Action"}
            </AlertDialogHeader>
            <AlertDialogBody>
              {actionJob && (
                <Text>
                  {language === "he"
                    ? `האם אתה בטוח שברצונך ${
                        actionJob.action === "delete"
                          ? "למחוק"
                          : actionJob.action === "restart"
                          ? "להתחיל מחדש"
                          : "לעצור"
                      } עבודה זו?`
                    : `Are you sure you want to ${actionJob.action} this job?`}
                </Text>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                {language === "he" ? "ביטול" : "Cancel"}
              </Button>
              <Button colorScheme="red" ml={3} onClick={confirmAction}>
                {language === "he" ? "אישור" : "Confirm"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};
