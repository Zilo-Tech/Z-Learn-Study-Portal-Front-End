// Node.js script to fetch and log /courses/ API response in your VS Code terminal
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000'; // Change if needed
const accessToken = process.env.ACCESS_TOKEN || '';

async function fetchCourses() {
  try {
    console.log('[log-courses.js] Fetching courses from API...');
    const res = await axios.get(`${API_BASE_URL}/courses/`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    console.log('[log-courses.js] API response:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('[log-courses.js] Error response:', err.response.status, err.response.data);
    } else {
      console.error('[log-courses.js] Error:', err.message);
    }
  }
}

fetchCourses();
