import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication if needed
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with an error status code
            console.error('API Error:', error.response.data);

            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                // Optionally redirect to login
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network Error:', error.request);
        } else {
            // Error in setting up the request
            console.error('Request Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api; 