import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;
