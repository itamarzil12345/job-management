using Microsoft.AspNetCore.SignalR;
using JobManagementHub.Hubs;

namespace JobManagementHub;

public class JobUpdateService : BackgroundService
{
    private readonly ILogger<JobUpdateService> _logger;
    private readonly IHubContext<JobSignalRHub> _hubContext;
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

    public JobUpdateService(ILogger<JobUpdateService> logger, IHubContext<JobSignalRHub> hubContext)
    {
        _logger = logger;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Job Update Service started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Wait 10 seconds between updates
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);

                // Select a random job to update
                var randomJob = _jobs[_random.Next(_jobs.Count)];
                
                // Handle different job statuses
                if (randomJob.Status == JobStatus.Running)
                {
                    // Update progress for running jobs
                    randomJob.Progress += _random.Next(5, 15);
                    
                    // Complete job if progress reaches 100%
                    if (randomJob.Progress >= 100)
                    {
                        randomJob.Progress = 100;
                        randomJob.Status = JobStatus.Completed;
                        randomJob.CompletedAt = DateTimeOffset.UtcNow;
                        _logger.LogInformation("Job {JobID} completed!", randomJob.JobID);
                    }
                    
                    // Send progress update
                    await SendJobUpdate(randomJob, stoppingToken);
                }
                else if (randomJob.Status == JobStatus.InQueue)
                {
                    // Move from queue to running
                    randomJob.Status = JobStatus.Running;
                    randomJob.StartedAt = DateTimeOffset.UtcNow;
                    randomJob.Progress = 0; // Start from 0%
                    _logger.LogInformation("Job {JobID} started running", randomJob.JobID);
                    
                    // Send status update
                    await SendJobUpdate(randomJob, stoppingToken);
                }
                else if (randomJob.Status == JobStatus.Completed)
                {
                    // Occasionally reset completed jobs to pending to keep the system dynamic
                    if (_random.Next(100) < 20) // 20% chance
                    {
                        randomJob.Status = JobStatus.Pending;
                        randomJob.Progress = 0;
                        randomJob.StartedAt = null;
                        randomJob.CompletedAt = null;
                        randomJob.ErrorMessage = null;
                        
                        _logger.LogInformation("Job {JobID} reset to pending", randomJob.JobID);
                        
                        // Send the updated jobs list
                        await _hubContext.Clients.All.SendAsync("JobsUpdated", _jobs, stoppingToken);
                        _logger.LogInformation("Sent updated jobs list after reset with {Count} jobs", _jobs.Count);
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Service is stopping, break the loop
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Job Update Service");
                // Continue running even if there's an error
            }
        }

        _logger.LogInformation("Job Update Service stopped");
    }

    private async Task SendJobUpdate(Job job, CancellationToken stoppingToken)
    {
        try
        {
            // Send progress update to all clients
            var update = new JobProgressUpdate
            {
                JobID = job.JobID,
                Name = job.Name,
                Status = (int)job.Status,
                Progress = job.Progress
            };

            await _hubContext.Clients.All.SendAsync("UpdateJobProgress", update, stoppingToken);
            _logger.LogInformation("Sent update for job {JobID}: Status={Status}, Progress={Progress}", 
                update.JobID, update.Status, update.Progress);

            // Also send the updated jobs list to refresh the table
            await _hubContext.Clients.All.SendAsync("JobsUpdated", _jobs, stoppingToken);
            _logger.LogInformation("Sent updated jobs list with {Count} jobs", _jobs.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending job update for job {JobID}", job.JobID);
        }
    }
}

// Data models (same as in JobSignalRHub)
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
    public string Name { get; set; } = string.Empty;
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
