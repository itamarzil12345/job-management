export enum JobStatus {
  Pending = 0,
  InQueue = 1,
  Running = 2,
  Completed = 3,
  Failed = 4,
  Stopped = 5,
}

export enum JobPriority {
  Regular = 0,
  High = 1,
}

export interface Job {
  jobID: string;
  name: string;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  createdAt: number;
  startedAt: number;
  completedAt: number;
  errorMessage: string | null;
}

export interface CreateJobRequest {
  name: string;
  priority: JobPriority;
}

export interface ApiResponse {
  isSuccess: boolean;
  message: string;
}

export interface JobProgressUpdate {
  jobID: string;
  name: string;
  status: JobStatus;
  progress: number;
}

export interface JobFilters {
  status?: JobStatus;
  search?: string;
  sortBy?: keyof Job;
  sortDirection?: "asc" | "desc";
}
