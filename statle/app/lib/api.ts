const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://statle-api.mercantec.tech/api'
    : 'http://localhost:5175/api'; // Assuming your local backend runs on port 5000

export default API_BASE_URL;
