# Job Management Backend Test Server

A Node.js Express test server that simulates the real backend API for the Job Management Dashboard frontend.

## Features

- **In-memory database** with 8 sample jobs
- **Real-time progress simulation** for running jobs
- **Full CRUD operations** for jobs
- **Business rule validation** (e.g., only certain statuses can be stopped/restarted)
- **CORS enabled** for frontend integration
- **Comprehensive error handling**
- **Health check endpoint**

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5001`

## API Endpoints

### Jobs Management

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/Jobs` | Fetch all jobs | None | `Job[]` |
| `POST` | `/Jobs` | Create new job | `{ name: string, priority: number }` | `Job` |
| `POST` | `/Jobs/:id/stop` | Stop running job | None | `ApiResponse` |
| `POST` | `/Jobs/:id/restart` | Restart failed/stopped job | None | `ApiResponse` |
| `DELETE` | `/Jobs/:id` | Delete specific job | None | `204 No Content` |
| `DELETE` | `/Jobs/status/:status` | Bulk delete by status | None | `204 No Content` |

### Health Check

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/health` | Server health status | Health info |

## Business Rules

### Job Status Transitions
- **Pending (0)** → **InQueue (1)** → **Running (2)** → **Completed (3)** or **Failed (4)**
- **Running (2)** or **InQueue (1)** → **Stopped (5)** (via stop action)
- **Failed (4)** or **Stopped (5)** → **Pending (0)** (via restart action)

### Action Constraints
- **Stop**: Only InQueue (1) and Running (2) jobs
- **Restart**: Only Failed (4) and Stopped (5) jobs  
- **Delete**: Only Completed (3), Failed (4), and Stopped (5) jobs
- **Bulk Delete**: Only Failed (4) and Completed (3) statuses

### Progress Updates
- Running jobs automatically progress every 3 seconds
- Jobs complete when progress reaches 100%
- Progress updates simulate real-time backend behavior

## Sample Data

The server starts with 8 pre-configured jobs:
- **Pending**: 1 job
- **In Queue**: 1 job
- **Running**: 2 jobs  
- **Completed**: 2 jobs
- **Failed**: 1 job
- **Stopped**: 1 job

## Testing the Frontend

1. **Start the backend server** (this server)
2. **Update frontend environment** to use real API:
   ```bash
   # In frontend .env file
   REACT_APP_USE_MOCK_DATA=false
   REACT_APP_API_BASE_URL=http://localhost:5001
   ```
3. **Start the frontend** - it will now communicate with this backend

## Development

- **Auto-restart**: Use `npm run dev` for development
- **Logging**: All API calls are logged to console
- **Error handling**: Comprehensive error responses with proper HTTP status codes
- **Validation**: Input validation for job creation and business rules

## Troubleshooting

- **Port conflicts**: Change `PORT` in `server.js` if 5001 is busy
- **CORS issues**: Server includes CORS headers for localhost development
- **Data persistence**: Data is in-memory and resets on server restart
