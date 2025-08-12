# 🚀 Job Management Dashboard - Full Stack Testing Setup

This guide will help you set up and test the complete Job Management Dashboard with both frontend and backend.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Two terminal windows/tabs

## 🏗️ Project Structure

```
job-management-dashboard/
├── src/                    # Frontend React app
├── backend/                # Express test server
├── .env                    # Frontend environment config
└── SETUP.md               # This file
```

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
```

**Expected Output:**

```
🚀 Job Management Backend Test Server running on http://localhost:5001
📊 Initial job count: 8
🔗 Health check: http://localhost:5001/health
📝 API endpoints:
   GET  /Jobs - Fetch all jobs
   POST /Jobs - Create new job
   POST /Jobs/:id/stop - Stop job
   POST /Jobs/:id/restart - Restart job
   DELETE /Jobs/:id - Delete job
   DELETE /Jobs/status/:status - Bulk delete by status
```

### Step 2: Test Backend API

```bash
# In a new terminal, test the API
cd backend
node test-api.js
```

**Expected Output:**

```
🧪 Testing Job Management Backend API...

1️⃣ Testing Health Check...
✅ Health Check: { status: 'OK', timestamp: '...', jobCount: 8, ... }

2️⃣ Testing Fetch All Jobs...
✅ Fetched 8 jobs

3️⃣ Testing Create New Job...
✅ Created job: [uuid]

4️⃣ Testing Stop Job...
✅ Stop job result: { isSuccess: true, message: 'Job stopped successfully' }

5️⃣ Testing Fetch Jobs After Changes...
✅ Fetched 9 jobs after changes

🎉 All API tests completed successfully!
📊 Total jobs: 9
🔗 Backend running at: http://localhost:5001
```

### Step 3: Start the Frontend

```bash
# Terminal 2 - Frontend
npm start
```

**Expected Output:**

```
Compiled successfully!
You can now view job-management-dashboard in the browser.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### Step 4: Switch Frontend to Use Backend

1. **Open** `http://localhost:3000` in your browser
2. **Update** the `.env` file to use the backend:
   ```bash
   # .env file
   REACT_APP_USE_MOCK_DATA=false
   REACT_APP_API_BASE_URL=http://localhost:5001
   ```
3. **Restart** the frontend development server
4. **Refresh** your browser

## 🔄 Testing Workflow

### 1. **View Jobs**

- Dashboard should display 8 jobs from the backend
- Status cards should show real counts
- Table should display backend data

### 2. **Create New Job**

- Click "Create New Job" button
- Fill in job name and priority
- Submit - job should appear in the table
- Check backend console for creation log

### 3. **Job Actions**

- **Stop**: Click stop button on Running/InQueue jobs
- **Restart**: Click restart on Failed/Stopped jobs
- **Delete**: Click delete on Completed/Failed/Stopped jobs
- Check backend console for action logs

### 4. **Bulk Operations**

- Click "Delete Jobs" button
- Select status (Failed or Completed)
- Confirm deletion
- Jobs should disappear from table

### 5. **Real-time Updates**

- Backend automatically updates running job progress every 3 seconds
- Watch progress bars increase in real-time
- Jobs complete automatically when progress reaches 100%

## 🧪 API Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:5001/health

# Get all jobs
curl http://localhost:5001/Jobs

# Create new job
curl -X POST http://localhost:5001/Jobs \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Job","priority":1}'

# Stop a job (replace JOB_ID)
curl -X POST http://localhost:5001/Jobs/JOB_ID/stop

# Delete a job (replace JOB_ID)
curl -X DELETE http://localhost:5001/Jobs/JOB_ID
```

### Browser Testing

1. **Open** `http://localhost:5001/health` - Should see server status
2. **Open** `http://localhost:5001/Jobs` - Should see JSON array of jobs

## 🔧 Troubleshooting

### Backend Issues

**Port already in use:**

```bash
# Change port in backend/server.js
const PORT = process.env.PORT || 5002;
```

**Dependencies not installed:**

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Can't connect to backend:**

- Check backend is running on port 5001
- Verify `.env` has correct URL
- Check browser console for CORS errors

**Still using mock data:**

- Ensure `.env` has `REACT_APP_USE_MOCK_DATA=false`
- Restart frontend development server
- Clear browser cache

### Data Issues

**Jobs not updating:**

- Backend data is in-memory and resets on restart
- Progress updates happen every 3 seconds
- Check backend console for error logs

## 📊 Expected Results

### Status Distribution

- **Pending**: 1 job
- **In Queue**: 1 job
- **Running**: 2 jobs
- **Completed**: 2 jobs
- **Failed**: 1 job
- **Stopped**: 1 job

### Real-time Features

- Progress bars update every 3 seconds
- Running jobs complete automatically
- Status changes reflect immediately in UI
- All CRUD operations work seamlessly

## 🎯 Next Steps

1. **Test all CRUD operations** thoroughly
2. **Verify business rules** (e.g., can't stop completed jobs)
3. **Test error handling** (e.g., invalid job IDs)
4. **Monitor backend logs** for debugging
5. **Add more test scenarios** as needed

## 🆘 Need Help?

- **Backend logs**: Check terminal running `npm start` in backend folder
- **Frontend logs**: Check browser console and terminal running `npm start`
- **API testing**: Use the `test-api.js` script or curl commands
- **Health check**: Visit `http://localhost:5001/health`

---

**Happy Testing! 🎉**
