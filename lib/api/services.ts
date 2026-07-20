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
    const response = await api.get('/admin/services');
    return response.data;
};

export const createService = async (data: Partial<Service>): Promise<Service> => {
    const response = await api.post('/admin/services', data);
    return response.data.service;
};

export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
    const response = await api.put(`/admin/services/${id}`, data);
    return response.data.service;
};

export const deleteService = async (id: number): Promise<void> => {
    await api.delete(`/admin/services/${id}`);
};
