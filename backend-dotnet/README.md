# ASP.NET Core SignalR Backend

A real SignalR backend server that provides real-time job updates to the React frontend.

## Features

- **SignalR Hub** at `/JobSignalRHub`
- **Real-time updates** every 10 seconds
- **Random job progress updates** for testing
- **CORS configured** for React frontend
- **Health check endpoint** at `/health`

## Prerequisites

- **.NET 8.0 SDK** or later
- **Visual Studio** or **VS Code** with C# extension

## Setup

### 1. Install .NET 8.0 SDK
```bash
# Check if .NET is installed
dotnet --version

# If not installed, download from: https://dotnet.microsoft.com/download/dotnet/8.0
```

### 2. Navigate to backend directory
```bash
cd backend-dotnet
```

### 3. Restore dependencies
```bash
dotnet restore
```

### 4. Build the project
```bash
dotnet build
```

### 5. Run the server
```bash
dotnet run
```

The server will start on `https://localhost:5001` (or `http://localhost:5000`)

## SignalR Hub

### Hub URL
```
https://localhost:5001/JobSignalRHub
```

### Events

#### **UpdateJobProgress**
Sent every 10 seconds with random job updates:
```json
{
  "jobID": "string",
  "status": 2,
  "progress": 75
}
```

#### **JobsUpdated**
Sent when jobs list changes:
```json
[
  {
    "jobID": "string",
    "name": "string",
    "status": 2,
    "priority": 1,
    "progress": 75,
    "createdAt": "2024-01-01T00:00:00Z",
    "startedAt": "2024-01-01T00:10:00Z",
    "completedAt": null,
    "errorMessage": null
  }
]
```

### Hub Methods

- **`GetJobs()`** - Returns all jobs
- **`CreateJob(name, priority)`** - Creates new job
- **`StopJob(jobID)`** - Stops running job
- **`RestartJob(jobID)`** - Restarts failed/stopped job
- **`DeleteJob(jobID)`** - Deletes job
- **`DeleteJobsByStatus(status)`** - Bulk delete by status

## Testing

### 1. Health Check
```bash
curl https://localhost:5001/health
```

### 2. SignalR Connection
The frontend will automatically connect to the hub when:
- `REACT_APP_USE_MOCK_DATA=false`
- Frontend is running on `http://localhost:3000`

### 3. Real-time Updates
- **Every 10 seconds**: Random job progress updates
- **Watch console**: See update logs
- **Frontend UI**: Updates automatically

## Configuration

### Port
Default: `5001` (HTTPS) or `5000` (HTTP)

To change port, modify `Properties/launchSettings.json` or use:
```bash
dotnet run --urls "https://localhost:5002"
```

### CORS
Configured for `http://localhost:3000` (React frontend)

## Troubleshooting

### Port already in use
```bash
# Use different port
dotnet run --urls "https://localhost:5002"
```

### SSL certificate issues
```bash
# Trust development certificate
dotnet dev-certs https --trust
```

### Frontend can't connect
- Check CORS configuration
- Verify hub URL matches frontend config
- Check console for connection errors

## Architecture

```
React Frontend (localhost:3000)
    ↓ WebSocket
ASP.NET Core SignalR Hub (localhost:5001)
    ↓ Timer (10s)
Random Job Updates
    ↓ SignalR Events
Frontend UI Updates
```

## Next Steps

1. **Start the backend**: `dotnet run`
2. **Set frontend env**: `REACT_APP_USE_MOCK_DATA=false`
3. **Start frontend**: `npm start`
4. **Watch real-time updates** every 10 seconds!
