using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace JobManagementHub.Hubs;

public class JobSignalRHub : Hub
{
    private readonly ILogger<JobSignalRHub> _logger;
    private static readonly Random _random = new Random();

    // Get jobs from the background service (for now, return empty list - the service handles updates)
    private static readonly List<Job> _jobs = new();

    public JobSignalRHub(ILogger<JobSignalRHub> logger)
    {
        _logger = logger;
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



    // Method to manually trigger a job update (for testing)
    public async Task TriggerJobUpdate()
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
            _logger.LogError(ex, "Error triggering job update");
        }
    }

    // Method to get all jobs
    public Task<List<Job>> GetJobs()
    {
        return Task.FromResult(_jobs);
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


