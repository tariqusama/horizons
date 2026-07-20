import axios from 'axios';

const BACKEND_URL = "https://horizon.co3.solutions";

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

export const initCsrf = async () => {
    await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
};

let inMemoryToken: string | null = null;

const safeGetStorageItem = (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSetStorageItem = (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, value);
    } catch {
        inMemoryToken = value;
    }
};

const safeRemoveStorageItem = (key: string) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch {
        inMemoryToken = null;
    }
};

export const getStoredToken = () => {
    if (inMemoryToken) return inMemoryToken;
    return safeGetStorageItem('authToken');
};

export const setAuthToken = (token: string | null) => {
    if (token) {
        safeSetStorageItem('authToken', token);
        inMemoryToken = token;
    } else {
        safeRemoveStorageItem('authToken');
        inMemoryToken = null;
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