import api from '../api';

export interface Profile {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    profile_picture?: string | null;
    profile_picture_url?: string | null;
    created_at: string;
}

export const getProfile = async (): Promise<Profile> => {
    const response = await api.get('/profile');
    return response.data;
};

export const updateProfile = async (data: any): Promise<any> => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const response = await api.post('/profile', data);
        return response.data;
    }

    const response = await api.put('/profile', data);
    return response.data;
};
