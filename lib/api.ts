import axios from 'axios';

const BACKEND_URL = "https://horizon.co3.solutions";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string | null) => {
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

setAuthToken(getStoredToken());

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Handle CSRF token mismatch
            if (error.response.status === 419) {
                // We could refresh CSRF and retry, but reloading or redirecting is safest
                // If we are on login, we might want to let the component handle it, or just reload to get fresh tokens
                if (typeof window !== 'undefined') {
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    } else {
                        // If they are on login page, force a reload to get fresh tokens
                        window.location.reload();
                    }
                }
            }

            // Handle Unauthorized
            if (error.response.status === 401) {
                if (
                    typeof window !== 'undefined' &&
                    window.location.pathname !== '/login' &&
                    window.location.pathname !== '/signup' &&
                    window.location.pathname !== '/admin/login'
                ) {
                    window.location.href = '/login';
                }
            }

            // Handle Forbidden (usually authorization/role-based access)
            if (error.response.status === 403) {
                if (typeof window !== 'undefined') {
                    if (window.location.pathname.startsWith('/admin')) {
                        window.location.href = '/dashboard';
                    } else if (window.location.pathname.startsWith('/manager')) {
                        window.location.href = '/dashboard';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;