import {
  Job,
  CreateJobRequest,
  ApiResponse,
  JobProgressUpdate,
} from "../types/job";

// Configuration
const USE_MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === "true";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// Mock data
const mockJobs: Job[] = [
  {
    jobID: "1",
    name: "Data Processing Job 1",
    status: 2, // Running
    priority: 1, // High
    progress: 65,
    createdAt: Date.now() - 3600000,
    startedAt: Date.now() - 3000000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "2",
    name: "Backup Job",
    status: 3, // Completed
    priority: 0, // Regular
    progress: 100,
    createdAt: Date.now() - 7200000,
    startedAt: Date.now() - 7000000,
    completedAt: Date.now() - 6000000,
    errorMessage: null,
  },
  {
    jobID: "3",
    name: "Failed Job",
    status: 4, // Failed
    priority: 1, // High
    progress: 45,
    createdAt: Date.now() - 1800000,
    startedAt: Date.now() - 1500000,
    completedAt: 0,
    errorMessage: "Connection timeout",
  },
  {
    jobID: "4",
    name: "Email Campaign Job",
    status: 1, // In Queue
    priority: 0, // Regular
    progress: 0,
    createdAt: Date.now() - 900000,
    startedAt: 0,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "5",
    name: "Report Generation",
    status: 2, // Running
    priority: 1, // High
    progress: 30,
    createdAt: Date.now() - 2400000,
    startedAt: Date.now() - 2000000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "6",
    name: "Database Cleanup",
    status: 5, // Stopped
    priority: 0, // Regular
    progress: 75,
    createdAt: Date.now() - 5400000,
    startedAt: Date.now() - 5000000,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "7",
    name: "File Sync Job",
    status: 0, // Pending
    priority: 1, // High
    progress: 0,
    createdAt: Date.now() - 300000,
    startedAt: 0,
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "8",
    name: "Log Analysis",
    status: 3, // Completed
    priority: 0, // Regular
    progress: 100,
    createdAt: Date.now() - 6000000,
    startedAt: Date.now() - 5800000,
    completedAt: Date.now() - 5700000,
    errorMessage: null,
  },
];

class JobService {
  private jobs: Job[] = [...mockJobs];

  // Real API methods
  private async realFetchJobs(): Promise<Job[]> {
    try {
      console.log("🔗 Fetching jobs from:", `${API_BASE_URL}/Jobs`);
      const response = await fetch(`${API_BASE_URL}/Jobs`);
      console.log("📡 Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }
      const jobs = await response.json();
      console.log("✅ Fetched jobs:", jobs.length);
      return jobs;
    } catch (error) {
      console.error("❌ Error fetching jobs from API:", error);
      throw new Error("Failed to fetch jobs from API");
    }
  }

  private async realCreateJob(request: CreateJobRequest): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/Jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Failed to create job: ${response.statusText}`);
    }
    return response.json();
  }

  private async realStopJob(jobID: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/Jobs/${jobID}/stop`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to stop job: ${response.statusText}`);
    }
    return response.json();
  }

  private async realRestartJob(jobID: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/Jobs/${jobID}/restart`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to restart job: ${response.statusText}`);
    }
    return response.json();
  }

  private async realDeleteJob(jobID: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Jobs/${jobID}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete job: ${response.statusText}`);
    }
  }

  private async realDeleteJobsByStatus(status: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Jobs/status/${status}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to delete jobs by status: ${response.statusText}`
      );
    }
  }

  // Mock API methods
  private mockFetchJobs(): Promise<Job[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.jobs]), 500);
    });
  }

  private mockCreateJob(request: CreateJobRequest): Promise<Job> {
    return new Promise((resolve) => {
      const newJob: Job = {
        jobID: Date.now().toString(),
        name: request.name,
        status: 0, // Pending
        priority: request.priority,
        progress: 0,
        createdAt: Date.now(),
        startedAt: 0,
        completedAt: 0,
        errorMessage: null,
      };
      this.jobs.push(newJob);
      setTimeout(() => resolve(newJob), 300);
    });
  }

  private mockStopJob(jobID: string): Promise<ApiResponse> {
    return new Promise((resolve) => {
      const job = this.jobs.find((j) => j.jobID === jobID);
      if (job && (job.status === 1 || job.status === 2)) {
        job.status = 5; // Stopped
        job.progress = 0;
      }
      setTimeout(
        () => resolve({ isSuccess: true, message: "Job stopped successfully" }),
        300
      );
    });
  }

  private mockRestartJob(jobID: string): Promise<ApiResponse> {
    return new Promise((resolve) => {
      const job = this.jobs.find((j) => j.jobID === jobID);
      if (job && (job.status === 4 || job.status === 5)) {
        job.status = 0; // Pending
        job.progress = 0;
        job.errorMessage = null;
      }
      setTimeout(
        () =>
          resolve({ isSuccess: true, message: "Job restarted successfully" }),
        300
      );
    });
  }

  private mockDeleteJob(jobID: string): Promise<void> {
    return new Promise((resolve) => {
      this.jobs = this.jobs.filter((j) => j.jobID !== jobID);
      setTimeout(() => resolve(), 300);
    });
  }

  private mockDeleteJobsByStatus(status: number): Promise<void> {
    return new Promise((resolve) => {
      this.jobs = this.jobs.filter((j) => j.status !== status);
      setTimeout(() => resolve(), 300);
    });
  }

  // Public API methods
  async fetchJobs(): Promise<Job[]> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockFetchJobs();
      } else {
        return this.realFetchJobs();
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

  async createJob(request: CreateJobRequest): Promise<Job> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockCreateJob(request);
      } else {
        return this.realCreateJob(request);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }

  async stopJob(jobID: string): Promise<ApiResponse> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockStopJob(jobID);
      } else {
        return this.realStopJob(jobID);
      }
    } catch (error) {
      console.error("Error stopping job:", error);
      throw error;
    }
  }

  async restartJob(jobID: string): Promise<ApiResponse> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockRestartJob(jobID);
      } else {
        return this.realRestartJob(jobID);
      }
    } catch (error) {
      console.error("Error restarting job:", error);
      throw error;
    }
  }

  async deleteJob(jobID: string): Promise<void> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockDeleteJob(jobID);
      } else {
        return this.realDeleteJob(jobID);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  }

  async deleteJobsByStatus(status: number): Promise<void> {
    try {
      if (USE_MOCK_DATA) {
        return this.mockDeleteJobsByStatus(status);
      } else {
        return this.realDeleteJobsByStatus(status);
      }
    } catch (error) {
      console.error("Error deleting jobs by status:", error);
      throw error;
    }
  }

  // Mock progress updates for demo
  startMockProgressUpdates(callback: (update: JobProgressUpdate) => void) {
    if (!USE_MOCK_DATA) return;

    setInterval(() => {
      const runningJobs = this.jobs.filter((j) => j.status === 2);
      runningJobs.forEach((job) => {
        if (job.progress < 100) {
          job.progress += Math.random() * 10;
          if (job.progress >= 100) {
            job.progress = 100;
            job.status = 3; // Completed
            job.completedAt = Date.now();
          }
          callback({
            jobID: job.jobID,
            status: job.status,
            progress: job.progress,
          });
        }
      });
    }, 2000);
  }
}

export const jobService = new JobService();
