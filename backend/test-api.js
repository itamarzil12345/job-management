const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001';

async function testAPI() {
  console.log('🧪 Testing Job Management Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: Fetch All Jobs
    console.log('2️⃣ Testing Fetch All Jobs...');
    const jobsResponse = await fetch(`${BASE_URL}/Jobs`);
    const jobs = await jobsResponse.json();
    console.log(`✅ Fetched ${jobs.length} jobs`);
    console.log('Sample job:', jobs[0]);
    console.log('');

    // Test 3: Create New Job
    console.log('3️⃣ Testing Create New Job...');
    const createResponse = await fetch(`${BASE_URL}/Jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Job from Script', priority: 1 })
    });
    const newJob = await createResponse.json();
    console.log('✅ Created job:', newJob.jobID);
    console.log('');

    // Test 4: Stop a Running Job
    console.log('4️⃣ Testing Stop Job...');
    const runningJob = jobs.find(j => j.status === 2); // Find a running job
    if (runningJob) {
      const stopResponse = await fetch(`${BASE_URL}/Jobs/${runningJob.jobID}/stop`, {
        method: 'POST'
      });
      const stopResult = await stopResponse.json();
      console.log('✅ Stop job result:', stopResult);
    } else {
      console.log('⚠️ No running jobs found to stop');
    }
    console.log('');

    // Test 5: Fetch Jobs Again (to see changes)
    console.log('5️⃣ Testing Fetch Jobs After Changes...');
    const updatedJobsResponse = await fetch(`${BASE_URL}/Jobs`);
    const updatedJobs = await updatedJobsResponse.json();
    console.log(`✅ Fetched ${updatedJobs.length} jobs after changes`);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log(`📊 Total jobs: ${updatedJobs.length}`);
    console.log(`🔗 Backend running at: ${BASE_URL}`);

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure the backend server is running on port 5001');
  }
}

// Run the test
testAPI();
