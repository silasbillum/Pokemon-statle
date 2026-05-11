const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://statle-api.mercantec.tech/api'
    : 'http://localhost:5175/api'; 

export default API_BASE_URL;
