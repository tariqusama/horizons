import api from '../api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    country: string | null;
    status: string;
    initials: string | null;
    color: string | null;
    profile_picture?: string | null;
    profile_picture_url?: string | null;
    created_at: string;
    joined?: string; // computed on frontend
}

export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

export const createUser = async (data: any): Promise<User> => {
    const response = await api.post('/api/admin/users', data);
    return response.data.user;
};

export const updateUserRole = async (id: number, role: string): Promise<User> => {
    const response = await api.put(`/api/admin/users/${id}/role`, { role });
    return response.data.user;
};

export const getUser = async (id: number): Promise<User> => {
    const response = await api.get(`/api/admin/users/${id}`);
    return response.data;
};

export const updateUserProfile = async (id: number, data: any): Promise<User> => {
    const response = await api.put(`/api/admin/users/${id}`, data);
    return response.data.user;
};

export const updateUserStatus = async (id: number, status: string): Promise<User> => {
    const response = await api.put(`/api/admin/users/${id}/status`, { status });
    return response.data.user;
};

export const resendVerification = async (email: string): Promise<void> => {
    await api.post('/auth/send-otp', { email });
};

export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
};
