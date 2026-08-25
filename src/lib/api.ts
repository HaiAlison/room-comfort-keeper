import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getAccessToken, getRefreshToken, removeTokens, setAccessToken, setRefreshToken } from './auth-tokens';

const BASE_URL = import.meta.env['VITE_API_URL'];

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Request Interceptor: Add Bearer Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Endpoints that should not trigger token refresh on 401
        const ignoredPaths = ['/auth/mfa/verify-login', '/auth/refresh', '/auth/login'];
        const isIgnoredPath = ignoredPaths.some(path => originalRequest.url?.includes(path));

        // If error is 401 and we haven't retried yet and it's not an ignored path
        if (error.response?.status === 401 && !originalRequest._retry && !isIgnoredPath) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Call refresh endpoint
                // standard refresher endpoint often expects refresh token in body
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken,
                });

                const { data: { access_token, refresh_token: new_refresh_token } } = response.data;
                setAccessToken(access_token);
                // If backend supports rotation/returns a new refresh token, save it
                if (new_refresh_token) {
                    setRefreshToken(new_refresh_token);
                }

                // Update authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (token expired or invalid) -> Logout
                removeTokens();
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
