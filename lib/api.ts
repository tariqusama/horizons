import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true,
});

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
