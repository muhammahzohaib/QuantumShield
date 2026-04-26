import axios from 'axios';
import { auth } from '../firebase/config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

// Automatic Token Injection Interceptor
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Handling & Error Redirect Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - Session expired or invalid token
      auth.signOut();
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Forbidden - Insufficient subscription role
      window.location.href = '/pricing';
    }
    return Promise.reject(error);
  }
);

export default api;
