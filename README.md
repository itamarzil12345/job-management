# Job Management Dashboard

A real-time job management dashboard built with React, TypeScript, and Chakra UI that monitors and controls distributed job processing.

## Features

### Core Features

- **Status Cards**: Real-time display of job counts for each status (Pending, In Queue, Running, Completed, Failed, Stopped)
- **Action Buttons**: Create new jobs and bulk delete jobs by status
- **Job Table**: Sortable and filterable list of all jobs with real-time progress updates
- **Progress Bars**: Visual job progress indicators (0-100%) with real-time updates
- **Job Actions**: Individual actions (Delete, Restart, Stop) with confirmation dialogs
- **Filtering & Sorting**: Filter by status, search by name, and sort by any column
- **Internationalization**: Full support for English and Hebrew with RTL support

### Technical Features

- React with TypeScript
- Chakra UI for modern, accessible components
- Real-time updates via SignalR (or mock simulation)
- Responsive design for all devices
- Service layer abstraction for easy switching between mock and real APIs
- Error handling and user feedback

## Project Structure

```
src/
├── components/           # React components
│   ├── JobDashboard.tsx # Main dashboard component
│   ├── StatusCards.tsx  # Status count cards
│   ├── JobTable.tsx     # Jobs table with filters
│   ├── CreateJobModal.tsx # Create job modal
│   ├── DeleteJobsModal.tsx # Delete jobs modal
│   └── LanguageSwitcher.tsx # Language toggle
├── contexts/            # React contexts
│   └── LanguageContext.tsx # Internationalization context
├── services/            # Service layer
│   └── jobService.ts   # Job API service with mock/real switching
├── types/               # TypeScript interfaces
│   └── job.ts          # Job-related types and enums
└── App.tsx             # Main application component
```

## System Architecture

The application uses a hybrid backend architecture with two specialized services:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           React Frontend (localhost:3000)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   JobDashboard  │  │  SignalRStatus  │  │        JobTable             │  │
│  │                 │  │                 │  │                             │  │
│  │ • Status Cards  │  │ • Connection    │  │ • Real-time Updates        │  │
│  │ • Action Buttons│  │ • Live Updates  │  │ • Progress Bars            │  │
│  │ • Modals        │  │ • Job History   │  │ • Job Actions              │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests (REST API)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Node.js Backend (localhost:5001)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Express Server                              │   │
│  │                                                                     │   │
│  │  REST Endpoints:                                                    │   │
│  │  • GET    /Jobs                    - Fetch all jobs                │   │
│  │  • POST   /Jobs                    - Create new job                │   │
│  │  • POST   /Jobs/{id}/stop          - Stop running job              │   │
│  │  • POST   /Jobs/{id}/restart       - Restart failed/stopped job    │   │
│  │  • DELETE /Jobs/{id}               - Delete specific job           │   │
│  │  • DELETE /Jobs/status/{status}    - Bulk delete by status         │   │
│  │                                                                     │   │
│  │  Features:                                                          │   │
│  │  • CRUD Operations                                                 │   │
│  │  • Business Logic Validation                                       │   │
│  │  • Error Handling                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ WebSocket Connection (SignalR)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   .NET Backend (localhost:5002)                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    ASP.NET Core SignalR                             │   │
│  │                                                                     │   │
│  │  SignalR Hub: /JobSignalRHub                                        │   │
│  │                                                                     │   │
│  │  Events Sent:                                                       │   │
│  │  • UpdateJobProgress               - Real-time job progress        │   │
│  │  • JobsUpdated                     - Complete jobs list update     │   │
│  │                                                                     │   │
│  │  Background Service:                                                │   │
│  │  • JobUpdateService                - Automatic job updates         │   │
│  │  • 10-second intervals             - Progress simulation           │   │
│  │  • Dynamic job lifecycle           - Complete/reset jobs           │   │
│  │                                                                     │   │
│  │  Features:                                                          │   │
│  │  • Real-time Updates                                               │   │
│  │  • WebSocket Management                                            │   │
│  │  • Connection State Management                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Overview

#### **Frontend (React + TypeScript)**

- **Single Page Application** with real-time UI updates
- **Chakra UI** for modern, responsive components
- **SignalR Client** for real-time communication
- **Service Layer** abstraction for backend switching

#### **Node.js Backend (REST API)**

- **Express.js** server handling HTTP requests
- **CRUD Operations** for job management
- **Business Logic** validation and error handling
- **In-memory Storage** for job data

#### **.NET Backend (SignalR)**

- **ASP.NET Core** with SignalR hub
- **Background Service** for automatic job updates
- **WebSocket Management** for real-time communication
- **Job Lifecycle Simulation** with dynamic progress

#### **Communication Flow**

1. **Frontend** connects to both backends simultaneously
2. **REST API** handles all CRUD operations (Create, Read, Update, Delete)
3. **SignalR** provides real-time updates and progress monitoring
4. **Background Service** simulates job processing every 10 seconds
5. **Frontend** receives updates and reflects changes in real-time

#### **Data Flow**

```
User Action → REST API → Job Update → SignalR → Frontend UI Update
     ↓
Background Service → Job Progress → SignalR → Real-time Display
```

#### **Key Benefits**

- **Separation of Concerns**: REST for operations, SignalR for real-time
- **Scalability**: Independent services can be scaled separately
- **Reliability**: Fallback mechanisms and error handling
- **Real-time Experience**: Live updates without page refresh
- **Flexibility**: Easy to switch between mock and real backends

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

The application can be configured to use either mock data or real API services. Create a `.env` file (or change env.example to .env) in the root directory:

```bash
# Set to 'true' to use mock data, 'false' to use real API
REACT_APP_USE_MOCK_DATA=true

# API Configuration (used when REACT_APP_USE_MOCK_DATA=false)
REACT_APP_API_BASE_URL=https://localhost:5001
REACT_APP_SIGNALR_HUB_URL=https://localhost:5001/JobSignalRHub

# Language Configuration
REACT_APP_DEFAULT_LANGUAGE=en
```

### Running the Application

#### Development Mode

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

#### Production Build

```bash
npm run build
```

#### Testing

```bash
npm test
```

## Backend Setup

If you are in real mode (and not in mock mode) The application requires both backends to work together:

- **Node.js/Express Backend**: Handles REST API operations (CRUD operations)
- **.NET SignalR Backend**: Provides real-time updates via SignalR

### Prerequisites

#### For Node.js Backend

- Node.js (v14 or higher)
- npm or yarn

#### For .NET Backend

- .NET 8.0 SDK or later
- Visual Studio or VS Code with C# extension

### Starting Both Backends

You'll need two terminal windows/tabs to run both backends simultaneously.

#### Terminal 1: Start Node.js Backend (REST API)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

**Expected Output:**

```
🚀 Job Management Backend Test Server running on http://localhost:5001
📊 Initial job count: 8
🔗 Health check: http://localhost:5001/health
```

#### Terminal 2: Start .NET Backend (SignalR)

```bash
# Navigate to backend directory
cd backend-dotnet

# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Run the server on port 5002
dotnet run --urls "https://localhost:5002"
```

**Expected Output:**

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5002
info: Microsoft.Hosting.Lifetime[0]
      Application started.
```

#### SSL Certificate (First Time Only)

If you encounter SSL certificate issues with the .NET backend:

```bash
dotnet dev-certs https --trust
```

### Backend Architecture

```
React Frontend (localhost:3000)
    ↓ HTTP Requests
Node.js Backend (localhost:5001) - REST API
    ↓ WebSocket Connection
.NET SignalR Backend (localhost:5002) - Real-time Updates
```

### Backend Configuration

#### Environment Variables

Update your frontend `.env` file to use both backends:

```bash
REACT_APP_USE_MOCK_DATA=false
REACT_APP_API_BASE_URL=http://localhost:5001
REACT_APP_SIGNALR_HUB_URL=https://localhost:5002/JobSignalRHub
```

#### Port Configuration

- **Node.js Backend**: Port 5001 (HTTP) - REST API
- **.NET Backend**: Port 5002 (HTTPS) - SignalR Hub

**Important**: The .NET backend runs on port 5002 to avoid conflicts with the Node.js backend on port 5001.

To change ports:

```bash
# Node.js - edit backend/server.js
const PORT = process.env.PORT || 5003;

# .NET - use command line
dotnet run --urls "https://localhost:5004"
```

### Backend Responsibilities

| Backend     | Purpose                     | Port | Protocol        |
| ----------- | --------------------------- | ---- | --------------- |
| **Node.js** | REST API (CRUD operations)  | 5001 | HTTP            |
| **.NET**    | SignalR (Real-time updates) | 5002 | HTTPS/WebSocket |

### Testing the Backends

#### Test Node.js Backend (REST API)

```bash
# In a new terminal
cd backend
node test-api.js
```

#### Test .NET Backend (SignalR)

The frontend will automatically connect to SignalR when both backends are running.

### Troubleshooting Backend Issues

#### Port Already in Use

```bash
# Change port in backend configuration
# Then update frontend .env file accordingly
```

#### Dependencies Not Installed

```bash
# Node.js Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# .NET Backend
cd backend-dotnet
dotnet restore
dotnet build
```

#### Frontend Can't Connect

- Verify backend is running on correct port
- Check `.env` file has correct URLs
- Ensure CORS is properly configured
- Check browser console for connection errors

## Switching Between Mock and Real Services

### Mock Mode (Default)

- Set `REACT_APP_USE_MOCK_DATA=true` in your `.env` file
- Uses simulated job data and progress updates
- No external API required
- Perfect for development and testing

### Real API Mode

- Set `REACT_APP_USE_MOCK_DATA=false` in your `.env` file
- Configure `REACT_APP_API_BASE_URL` and `REACT_APP_SIGNALR_HUB_URL`
- Requires a running backend service at the specified URLs
- Real-time updates via SignalR hub

## API Specification

### REST Endpoints

- `GET /Jobs` - Fetch all jobs
- `POST /Jobs` - Create new job
- `POST /Jobs/{jobID}/stop` - Stop running job
- `POST /Jobs/{jobID}/restart` - Restart failed/stopped job
- `DELETE /Jobs/{jobID}` - Delete specific job
- `DELETE /Jobs/status/{status}` - Bulk delete by status

### SignalR Events

- `UpdateJobProgress` - Real-time job progress updates

### Data Models

- **Job**: Complete job information with status, priority, progress, and timestamps
- **CreateJobRequest**: Job creation payload
- **JobProgressUpdate**: Real-time progress update payload

## Business Rules

### Job Lifecycle

- New jobs start as Pending (0) → InQueue (1) → Running (2) → Completed (3) or Failed (4)
- Progress updates from 0 to 100 during execution

### Operation Constraints

- Only Running and InQueue jobs can be stopped
- Only Failed and Stopped jobs can be restarted
- Individual delete: Completed, Failed, and Stopped jobs only
- Bulk delete: Failed and Completed statuses only

## Internationalization

The application supports both English and Hebrew:

- **English**: Default language with LTR layout
- **Hebrew**: Full RTL support with Hebrew translations
- Language can be switched dynamically using the language switcher
- All user-facing text is translated
- Timestamps and job names remain in their original format

## Responsive Design

The dashboard is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices
- All screen sizes with appropriate breakpoints

## Error Handling

The application includes comprehensive error handling:

- API error responses
- Network connectivity issues
- SignalR disconnections
- User input validation
- Graceful fallbacks for failed operations

## Development

### Adding New Features

1. Create new components in the `components/` directory
2. Add new types to `types/job.ts`
3. Extend the service layer in `services/jobService.ts`
4. Update the main dashboard as needed

### Styling

The application uses Chakra UI for consistent, accessible styling. Custom styles can be added using Chakra's theme system or inline styles.

### Testing

- Unit tests for components and services
- Integration tests for user workflows
- Mock data for consistent testing scenarios

## Troubleshooting

### Common Issues

1. **Mock data not working**: Ensure `REACT_APP_USE_MOCK_DATA=true` in your `.env` file
2. **Real API connection issues**: Check your API base URL and ensure the backend is running
3. **Language switching not working**: Clear browser cache and restart the development server
4. **Build errors**: Ensure all dependencies are installed with `npm install`

### Performance

- The application is optimized for real-time updates
- Large job lists are handled efficiently with proper React optimization
- Progress updates are throttled to prevent excessive re-renders

## Contributing

1. Follow the existing code structure and patterns
2. Add appropriate TypeScript types for new features
3. Include error handling for new operations
4. Test with both mock and real API modes
5. Ensure responsive design for new components

## License

This project is created for assessment purposes.
