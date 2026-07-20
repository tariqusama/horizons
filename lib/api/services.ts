import api from '../api';

export interface Service {
    id: number;
    name: string;
    description: string | null;
    price: number;
    tier: string;
    created_at?: string;
    updated_at?: string;
}

export const getServices = async (): Promise<Service[]> => {
    const response = await api.get('/api/admin/services');
    return response.data;
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
    const response = await api.post('/api/admin/services', data);
    return response.data.service;
};

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
    const response = await api.put(`/api/admin/services/${id}`, data);
    return response.data.service;
};

export const deleteService = async (id: number): Promise<void> => {
    await api.delete(`/api/admin/services/${id}`);
};
