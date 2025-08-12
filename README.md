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

The application can be configured to use either mock data or real API services. Create a `.env` file in the root directory:

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
