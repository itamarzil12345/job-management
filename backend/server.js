const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database
let jobs = [
  {
    jobID: "1",
    name: "Data Processing Job 1",
    status: 2, // Running
    priority: 1, // High
    progress: 65,
    createdAt: Date.now() - 3600000, // 1 hour ago
    startedAt: Date.now() - 3000000, // 50 minutes ago
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "2",
    name: "Backup Job",
    status: 3, // Completed
    priority: 0, // Regular
    progress: 100,
    createdAt: Date.now() - 7200000, // 2 hours ago
    startedAt: Date.now() - 3600000, // 1 hour ago
    completedAt: Date.now() - 1800000, // 30 minutes ago
    errorMessage: null,
  },
  {
    jobID: "3",
    name: "Failed Job",
    status: 4, // Failed
    priority: 1, // High
    progress: 45,
    createdAt: Date.now() - 1800000, // 30 minutes ago
    startedAt: Date.now() - 1500000, // 25 minutes ago
    completedAt: 0,
    errorMessage: "Connection timeout",
  },
  {
    jobID: "4",
    name: "Email Campaign Job",
    status: 1, // In Queue
    priority: 0, // Regular
    progress: 0,
    createdAt: Date.now() - 900000, // 15 minutes ago
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
    createdAt: Date.now() - 2400000, // 40 minutes ago
    startedAt: Date.now() - 1200000, // 20 minutes ago
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "6",
    name: "Database Cleanup",
    status: 5, // Stopped
    priority: 0, // Regular
    progress: 75,
    createdAt: Date.now() - 5400000, // 90 minutes ago
    startedAt: Date.now() - 4800000, // 80 minutes ago
    completedAt: 0,
    errorMessage: null,
  },
  {
    jobID: "7",
    name: "File Sync Job",
    status: 0, // Pending
    priority: 1, // High
    progress: 0,
    createdAt: Date.now() - 300000, // 5 minutes ago
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
    createdAt: Date.now() - 6000000, // 100 minutes ago
    startedAt: Date.now() - 4800000, // 80 minutes ago
    completedAt: Date.now() - 4200000, // 70 minutes ago
    errorMessage: null,
  },
];

// Helper function to find job by ID
const findJobById = (jobID) => jobs.find((job) => job.jobID === jobID);

// Helper function to update job progress (simulate real-time updates)
const simulateProgressUpdates = () => {
  setInterval(() => {
    jobs.forEach((job) => {
      if (job.status === 2 && job.progress < 100) {
        // Running jobs
        job.progress += Math.random() * 10;
        if (job.progress >= 100) {
          job.progress = 100;
          job.status = 3; // Completed
          job.completedAt = Date.now();
        }
      }
    });
  }, 3000); // Update every 3 seconds
};

// Start progress simulation
simulateProgressUpdates();

// Routes

// GET /Jobs - Fetch all jobs
app.get("/Jobs", (req, res) => {
  try {
    console.log("GET /Jobs - Returning", jobs.length, "jobs");
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// POST /Jobs - Create new job
app.post("/Jobs", (req, res) => {
  try {
    const { name, priority } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        isSuccess: false,
        message: "Job name is required and must be at least 3 characters",
      });
    }

    const newJob = {
      jobID: uuidv4(),
      name: name.trim(),
      status: 0, // Pending
      priority: priority || 0,
      progress: 0,
      createdAt: Date.now(),
      startedAt: 0,
      completedAt: 0,
      errorMessage: null,
    };

    jobs.push(newJob);
    console.log("POST /Jobs - Created job:", newJob.jobID);

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// POST /Jobs/{jobID}/stop - Stop running job
app.post("/Jobs/:jobID/stop", (req, res) => {
  try {
    const { jobID } = req.params;
    const job = findJobById(jobID);

    if (!job) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Job not found" });
    }

    if (job.status !== 1 && job.status !== 2) {
      // Only InQueue or Running jobs can be stopped
      return res.status(400).json({
        isSuccess: false,
        message: "Only InQueue or Running jobs can be stopped",
      });
    }

    job.status = 5; // Stopped
    job.progress = 0;
    console.log("POST /Jobs/" + jobID + "/stop - Job stopped");

    res.json({ isSuccess: true, message: "Job stopped successfully" });
  } catch (error) {
    console.error("Error stopping job:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// POST /Jobs/{jobID}/restart - Restart failed/stopped job
app.post("/Jobs/:jobID/restart", (req, res) => {
  try {
    const { jobID } = req.params;
    const job = findJobById(jobID);

    if (!job) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Job not found" });
    }

    if (job.status !== 4 && job.status !== 5) {
      // Only Failed or Stopped jobs can be restarted
      return res.status(400).json({
        isSuccess: false,
        message: "Only Failed or Stopped jobs can be restarted",
      });
    }

    job.status = 0; // Pending
    job.progress = 0;
    job.errorMessage = null;
    console.log("POST /Jobs/" + jobID + "/restart - Job restarted");

    res.json({ isSuccess: true, message: "Job restarted successfully" });
  } catch (error) {
    console.error("Error restarting job:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// DELETE /Jobs/{jobID} - Delete specific job
app.delete("/Jobs/:jobID", (req, res) => {
  try {
    const { jobID } = req.params;
    const job = findJobById(jobID);

    if (!job) {
      return res
        .status(404)
        .json({ isSuccess: false, message: "Job not found" });
    }

    if (job.status !== 3 && job.status !== 4 && job.status !== 5) {
      // Only Completed, Failed, or Stopped jobs can be deleted
      return res.status(400).json({
        isSuccess: false,
        message: "Only Completed, Failed, or Stopped jobs can be deleted",
      });
    }

    jobs = jobs.filter((j) => j.jobID !== jobID);
    console.log("DELETE /Jobs/" + jobID + " - Job deleted");

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting job:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// DELETE /Jobs/status/{status} - Bulk delete by status
app.delete("/Jobs/status/:status", (req, res) => {
  try {
    const { status } = req.params;
    const statusNum = parseInt(status);

    if (statusNum !== 3 && statusNum !== 4) {
      // Only Failed and Completed statuses can be bulk deleted
      return res.status(400).json({
        isSuccess: false,
        message: "Only Failed and Completed statuses can be bulk deleted",
      });
    }

    const initialCount = jobs.length;
    jobs = jobs.filter((job) => job.status !== statusNum);
    const deletedCount = initialCount - jobs.length;

    console.log(
      "DELETE /Jobs/status/" + status + " - Deleted",
      deletedCount,
      "jobs"
    );

    res.status(204).send();
  } catch (error) {
    console.error("Error bulk deleting jobs:", error);
    res
      .status(500)
      .json({ isSuccess: false, message: "Internal server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    jobCount: jobs.length,
    server: "Job Management Backend Test Server",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ isSuccess: false, message: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ isSuccess: false, message: "Endpoint not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Job Management Backend Test Server running on http://localhost:${PORT}`
  );
  console.log(`📊 Initial job count: ${jobs.length}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET  /Jobs - Fetch all jobs`);
  console.log(`   POST /Jobs - Create new job`);
  console.log(`   POST /Jobs/:id/stop - Stop job`);
  console.log(`   POST /Jobs/:id/restart - Restart job`);
  console.log(`   DELETE /Jobs/:id - Delete job`);
  console.log(`   DELETE /Jobs/status/:status - Bulk delete by status`);
});
