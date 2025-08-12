using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace JobManagementHub.Hubs;

public class JobSignalRHub : Hub
{
    private readonly ILogger<JobSignalRHub> _logger;
    private readonly Timer _updateTimer;
    private readonly Random _random = new Random();

    // Sample jobs for testing
    private readonly List<Job> _jobs = new()
    {
        new Job { JobID = "1", Name = "Data Processing Job 1", Status = JobStatus.Running, Priority = JobPriority.High, Progress = 65, CreatedAt = DateTimeOffset.UtcNow.AddHours(-1), StartedAt = DateTimeOffset.UtcNow.AddMinutes(-50), CompletedAt = null, ErrorMessage = null },
        new Job { JobID = "2", Name = "Backup Job", Status = JobStatus.Completed, Priority = JobPriority.Regular, Progress = 100, CreatedAt = DateTimeOffset.UtcNow.AddHours(-2), StartedAt = DateTimeOffset.UtcNow.AddHours(-1), CompletedAt = DateTimeOffset.UtcNow.AddMinutes(-30), ErrorMessage = null },
        new Job { JobID = "3", Name = "Failed Job", Status = JobStatus.Failed, Priority = JobPriority.High, Progress = 45, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-30), StartedAt = DateTimeOffset.UtcNow.AddMinutes(-25), CompletedAt = null, ErrorMessage = "Connection timeout" },
        new Job { JobID = "4", Name = "Email Campaign Job", Status = JobStatus.InQueue, Priority = JobPriority.Regular, Progress = 0, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-15), StartedAt = null, CompletedAt = null, ErrorMessage = null },
        new Job { JobID = "5", Name = "Report Generation", Status = JobStatus.Running, Priority = JobPriority.High, Progress = 30, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-40), StartedAt = DateTimeOffset.UtcNow.AddMinutes(-20), CompletedAt = null, ErrorMessage = null },
        new Job { JobID = "6", Name = "Database Cleanup", Status = JobStatus.Stopped, Priority = JobPriority.Regular, Progress = 75, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-90), StartedAt = DateTimeOffset.UtcNow.AddMinutes(-80), CompletedAt = null, ErrorMessage = null },
        new Job { JobID = "7", Name = "File Sync Job", Status = JobStatus.Pending, Priority = JobPriority.High, Progress = 0, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-5), StartedAt = null, CompletedAt = null, ErrorMessage = null },
        new Job { JobID = "8", Name = "Log Analysis", Status = JobStatus.Completed, Priority = JobPriority.Regular, Progress = 100, CreatedAt = DateTimeOffset.UtcNow.AddMinutes(-100), StartedAt = DateTimeOffset.UtcNow.AddMinutes(-80), CompletedAt = DateTimeOffset.UtcNow.AddMinutes(-70), ErrorMessage = null }
    };

    public JobSignalRHub(ILogger<JobSignalRHub> logger)
    {
        _logger = logger;
        
        // Start timer to send updates every 10 seconds
        _updateTimer = new Timer(SendRandomUpdates, null, TimeSpan.Zero, TimeSpan.FromSeconds(10));
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        
        // Send current jobs to newly connected client
        await Clients.Caller.SendAsync("JobsUpdated", _jobs);
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    private async void SendRandomUpdates(object? state)
    {
        try
        {
            // Select a random job to update
            var randomJob = _jobs[_random.Next(_jobs.Count)];
            
            // Only update jobs that are running or in queue
            if (randomJob.Status == JobStatus.Running || randomJob.Status == JobStatus.InQueue)
            {
                // Random progress update
                if (randomJob.Status == JobStatus.Running)
                {
                    randomJob.Progress += _random.Next(5, 15);
                    
                    // Complete job if progress reaches 100%
                    if (randomJob.Progress >= 100)
                    {
                        randomJob.Progress = 100;
                        randomJob.Status = JobStatus.Completed;
                        randomJob.CompletedAt = DateTimeOffset.UtcNow;
                    }
                }
                else if (randomJob.Status == JobStatus.InQueue)
                {
                    // Move from queue to running
                    randomJob.Status = JobStatus.Running;
                    randomJob.StartedAt = DateTimeOffset.UtcNow;
                }

                // Send update to all clients
                var update = new JobProgressUpdate
                {
                    JobID = randomJob.JobID,
                    Status = (int)randomJob.Status,
                    Progress = randomJob.Progress
                };

                await Clients.All.SendAsync("UpdateJobProgress", update);
                _logger.LogInformation("Sent update for job {JobID}: Status={Status}, Progress={Progress}", 
                    update.JobID, update.Status, update.Progress);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending random updates");
        }
    }

    // Method to get all jobs
    public async Task<List<Job>> GetJobs()
    {
        return _jobs;
    }

    // Method to create a new job
    public async Task<Job> CreateJob(string name, int priority)
    {
        var newJob = new Job
        {
            JobID = Guid.NewGuid().ToString(),
            Name = name,
            Status = JobStatus.Pending,
            Priority = (JobPriority)priority,
            Progress = 0,
            CreatedAt = DateTimeOffset.UtcNow,
            StartedAt = null,
            CompletedAt = null,
            ErrorMessage = null
        };

        _jobs.Add(newJob);
        
        // Notify all clients about the new job
        await Clients.All.SendAsync("JobsUpdated", _jobs);
        
        return newJob;
    }

    // Method to stop a job
    public async Task<bool> StopJob(string jobID)
    {
        var job = _jobs.FirstOrDefault(j => j.JobID == jobID);
        if (job != null && (job.Status == JobStatus.Running || job.Status == JobStatus.InQueue))
        {
            job.Status = JobStatus.Stopped;
            job.Progress = 0;
            
            var update = new JobProgressUpdate
            {
                JobID = job.JobID,
                Status = (int)job.Status,
                Progress = job.Progress
            };

            await Clients.All.SendAsync("UpdateJobProgress", update);
            return true;
        }
        return false;
    }

    // Method to restart a job
    public async Task<bool> RestartJob(string jobID)
    {
        var job = _jobs.FirstOrDefault(j => j.JobID == jobID);
        if (job != null && (job.Status == JobStatus.Failed || job.Status == JobStatus.Stopped))
        {
            job.Status = JobStatus.Pending;
            job.Progress = 0;
            job.ErrorMessage = null;
            
            var update = new JobProgressUpdate
            {
                JobID = job.JobID,
                Status = (int)job.Status,
                Progress = job.Progress
            };

            await Clients.All.SendAsync("UpdateJobProgress", update);
            return true;
        }
        return false;
    }

    // Method to delete a job
    public async Task<bool> DeleteJob(string jobID)
    {
        var job = _jobs.FirstOrDefault(j => j.JobID == jobID);
        if (job != null && (job.Status == JobStatus.Completed || job.Status == JobStatus.Failed || job.Status == JobStatus.Stopped))
        {
            _jobs.Remove(job);
            await Clients.All.SendAsync("JobsUpdated", _jobs);
            return true;
        }
        return false;
    }

    // Method to delete jobs by status
    public async Task<int> DeleteJobsByStatus(int status)
    {
        var jobsToDelete = _jobs.Where(j => (int)j.Status == status).ToList();
        var count = jobsToDelete.Count;
        
        foreach (var job in jobsToDelete)
        {
            _jobs.Remove(job);
        }
        
        if (count > 0)
        {
            await Clients.All.SendAsync("JobsUpdated", _jobs);
        }
        
        return count;
    }
}

// Data models
public class Job
{
    public string JobID { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public JobStatus Status { get; set; }
    public JobPriority Priority { get; set; }
    public int Progress { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? StartedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public string? ErrorMessage { get; set; }
}

public class JobProgressUpdate
{
    public string JobID { get; set; } = string.Empty;
    public int Status { get; set; }
    public int Progress { get; set; }
}

public enum JobStatus
{
    Pending = 0,
    InQueue = 1,
    Running = 2,
    Completed = 3,
    Failed = 4,
    Stopped = 5
}

public enum JobPriority
{
    Regular = 0,
    High = 1
}
