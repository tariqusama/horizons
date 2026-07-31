import api from '../api';

export interface ServicePackage {
    id?: number;
    name: string;
    price: number;
    order_index: number;
    features?: string[] | null;
}

export interface Service {
    id: number;
    title: string;
    subtitle: string | null;
    starting_price: number;
    processing_time?: string | null;
    is_popular?: boolean;
    order_index?: number;
    packages?: ServicePackage[];
    created_at?: string;
    updated_at?: string;
}

export const getServices = async (): Promise<Service[]> => {
    const response = await api.get('/services');
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
