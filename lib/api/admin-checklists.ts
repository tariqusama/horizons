import api from '../api';

export interface Checklist {
    id: number;
    key: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    forms: string[] | null;
    total_documents: number;
    sections: any[];
}

export const getAdminChecklists = async (): Promise<Checklist[]> => {
    const res = await api.get('/admin/checklists');
    return res.data;
};

export const getAdminChecklist = async (id: number): Promise<Checklist> => {
    const res = await api.get(`/admin/checklists/${id}`);
    return res.data;
};

export const createAdminChecklist = async (data: Partial<Checklist>): Promise<Checklist> => {
    const res = await api.post('/admin/checklists', data);
    return res.data.checklist;
};

export const updateAdminChecklist = async (id: number, data: Partial<Checklist>): Promise<Checklist> => {
    const res = await api.put(`/admin/checklists/${id}`, data);
    return res.data.checklist;
};

export const deleteAdminChecklist = async (id: number): Promise<void> => {
    await api.delete(`/admin/checklists/${id}`);
};
