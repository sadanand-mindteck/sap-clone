import axios from 'axios';

// Create a configured instance
export const apiClient = axios.create({
  baseURL: '/api', // This will be intercepted by axios-mock-adapter
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you'd get this from a store or cookie
    const token = localStorage.getItem('access_token') || 'sample-jwt-token-xyz-123';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // SAP/Enterprise metadata headers often used for tracing
    config.headers['X-App-Version'] = '1.0.0';
    config.headers['X-Client-Id'] = 'WEB_ERP_CLIENT';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.warn('Unauthorized access - Token might be expired');
    }
    return Promise.reject(error);
  }
);