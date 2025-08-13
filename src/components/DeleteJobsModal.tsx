import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { JobStatus } from "../types/job";
import { useLanguage } from "../contexts/LanguageContext";
import { getGrayColor } from "../theme";

interface DeleteJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteJobs: (status: number) => void;
}

export const DeleteJobsModal: React.FC<DeleteJobsModalProps> = ({
  isOpen,
  onClose,
  onDeleteJobs,
}) => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast();

  const [selectedStatus, setSelectedStatus] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedStatus === "") return;

    setIsSubmitting(true);
    try {
      await onDeleteJobs(selectedStatus);
      toast({
        title:
          language === "he"
            ? "העבודות נמחקו בהצלחה"
            : "Jobs deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (error) {
      toast({
        title:
          language === "he" ? "שגיאה במחיקת העבודות" : "Error deleting jobs",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  const getStatusLabel = (status: JobStatus) => {
    const statusLabels: Record<JobStatus, string> = {
      [JobStatus.Pending]: language === "he" ? "ממתין" : "Pending",
      [JobStatus.InQueue]: language === "he" ? "בתור" : "In Queue",
      [JobStatus.Running]: language === "he" ? "רץ" : "Running",
      [JobStatus.Completed]: language === "he" ? "הושלמו" : "Completed",
      [JobStatus.Failed]: language === "he" ? "נכשלו" : "Failed",
      [JobStatus.Stopped]: language === "he" ? "עצר" : "Stopped",
    };
    return statusLabels[status];
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {language === "he" ? "מחק עבודות לפי סטטוס" : "Delete Jobs by Status"}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning">
              <AlertIcon />
              <Text fontSize="sm">
                {language === "he"
                  ? "פעולה זו תמחק את כל העבודות עם הסטטוס הנבחר. פעולה זו אינה הפיכה."
                  : "This action will delete all jobs with the selected status. This action cannot be undone."}
              </Text>
            </Alert>

            <FormControl>
              <FormLabel>
                {language === "he"
                  ? "בחר סטטוס למחיקה"
                  : "Select Status to Delete"}
              </FormLabel>
              <Select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                placeholder={
                  language === "he" ? "בחר סטטוס..." : "Select status..."
                }
              >
                {([JobStatus.Completed, JobStatus.Failed] as const).map(
                  (status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  )
                )}
              </Select>
            </FormControl>

            {selectedStatus !== "" && (
              <Text fontSize="sm" color={getGrayColor("600", isDark)}>
                {language === "he"
                  ? `כל העבודות עם הסטטוס "${getStatusLabel(
                      selectedStatus as JobStatus
                    )}" ימחקו.`
                  : `All jobs with status "${getStatusLabel(
                      selectedStatus as JobStatus
                    )}" will be deleted.`}
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            {language === "he" ? "ביטול" : "Cancel"}
          </Button>
          <Button
            colorScheme="red"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText={language === "he" ? "מוחק..." : "Deleting..."}
            isDisabled={selectedStatus === ""}
          >
            {language === "he" ? "מחק" : "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
