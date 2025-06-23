import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5194/api',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ?? Intercept failed responses globally
instance.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(err);
    }
);

export default instance;