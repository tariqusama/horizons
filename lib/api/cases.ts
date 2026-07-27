import api from '../api';

export interface Application {
    id: number;
    user_id: number;
    manager_id: number | null;
    title: string;
    package_name: string | null;
    subtitle: string | null;
    amount?: number;
    paid_amount?: number;
    status: string;
    progress: string;
    priority?: string;
    service_type?: string;
    next_step: string | null;
    is_escalated?: boolean;
    is_requested?: boolean;
    receipt_number: string | null;
    created_at: string;
    timeline?: Array<{
        id: string;
        author: string;
        text: string;
        created_at: string;
    }>;
    internal_notes?: Array<{
        id: string;
        author: string;
        text: string;
        created_at: string;
    }>;
    documents?: Array<{
        id: number;
        name: string;
        status: string;
        file_path: string | null;
        created_at: string;
    }>;
    form_data?: Record<string, any>;
    user?: {
        id: number;
        name: string;
        email: string;
        initials: string;
        color: string;
        role?: string;
        phone?: string;
    };
    manager?: {
        id: number;
        name: string;
        email: string;
        initials: string;
        color: string;
        role?: string;
    };
}

export interface AssignmentRequest {
    id: number;
    application_id: number;
    manager_id: number;
    status: string;
    notes: string | null;
    created_at: string;
    application?: Application;
    manager?: {
        id: number;
        name: string;
        email: string;
        initials: string;
        color: string;
        role?: string;
    };
}

export interface MessagePayload {
    id: number;
    user_id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
    attachment_path?: string;
    attachment_name?: string;
}

export interface DocumentPayload {
    id: number;
    application_id: number;
    name: string;
    status: string;
    file_path: string | null;
    created_at: string;
}

export const getCases = async (): Promise<Application[]> => {
    const response = await api.get('/admin/cases');
    return response.data;
};

export const getManagerAssignedCases = async (): Promise<Application[]> => {
    const response = await api.get('/manager/assigned-cases');
    return response.data;
};

export const getManagerUnassignedCases = async (): Promise<Application[]> => {
    const response = await api.get('/manager/unassigned-cases');
    return response.data;
};

export const requestCaseAssignment = async (id: number): Promise<void> => {
    await api.post(`/manager/applications/${id}/request-assignment`);
};

export const assignCaseManager = async (id: number, managerId: number | null): Promise<Application> => {
    const response = await api.put(`/admin/cases/${id}/assign`, { manager_id: managerId });
    return response.data.application;
};

export interface AssignmentRequestListResponse {
    data: AssignmentRequest[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export const getAssignmentRequests = async (params: Record<string, any> = {}): Promise<AssignmentRequestListResponse> => {
    const response = await api.get('/admin/assignment-requests', { params });
    return response.data;
};

export const getAssignmentRequest = async (id: number): Promise<AssignmentRequest> => {
    const response = await api.get(`/admin/assignment-requests/${id}`);
    return response.data;
};

export const updateAssignmentRequest = async (id: number, status: string): Promise<AssignmentRequest> => {
    const response = await api.put(`/admin/assignment-requests/${id}`, { status });
    return response.data.request;
};

export const updateCaseStatus = async (id: number, status: string): Promise<Application> => {
    const response = await api.put(`/admin/applications/${id}`, { status });
    return response.data;
};

export const updateApplication = async (
    id: number,
    payload: Partial<Pick<Application, 'status' | 'progress' | 'next_step' | 'timeline' | 'title' | 'package_name' | 'subtitle' | 'amount' | 'paid_amount' | 'receipt_number' | 'is_escalated' | 'internal_notes' | 'form_data'>>
): Promise<Application> => {
    const response = await api.put(`/manager/applications/${id}`, payload);
    return response.data;
};

export const getManagerMessages = async (applicationId: number): Promise<MessagePayload[]> => {
    const response = await api.get(`/manager/applications/${applicationId}/messages`);
    return response.data;
};

export const sendManagerMessage = async (applicationId: number, message: string, file?: File | null): Promise<MessagePayload> => {
    if (file) {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('file', file);
        const response = await api.post(`/manager/applications/${applicationId}/messages`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } else {
        const response = await api.post(`/manager/applications/${applicationId}/messages`, { message });
        return response.data;
    }
};

export const getManagerDocuments = async (applicationId: number): Promise<DocumentPayload[]> => {
    const response = await api.get(`/manager/applications/${applicationId}/documents`);
    return response.data;
};

export const requestManagerDocuments = async (applicationId: number, documents: string, note: string): Promise<{ request: any; application: Application }> => {
    const response = await api.post(`/manager/applications/${applicationId}/documents/requests`, { documents, note });
    return response.data;
};

export const escalateApplication = async (applicationId: number, reason: string): Promise<any> => {
    const response = await api.post(`/manager/applications/${applicationId}/escalate`, { reason });
    return response.data;
};

export interface Service {
    id: number;
    name: string;
    description: string | null;
    price: number;
    tier: string | null;
}

export const getServices = async (): Promise<Service[]> => {
    const response = await api.get('/services');
    return response.data;
};

export const getChecklists = async (): Promise<Record<string, any>> => {
    const response = await api.get('/checklists');
    return response.data;
};
