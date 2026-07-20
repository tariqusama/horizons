import api from '../api';

export interface Application {
    id: number;
    user_id: number;
    manager_id: number | null;
    title: string;
    subtitle: string | null;
    status: string;
    progress: string;
    priority?: string;
    service_type?: string;
    next_step: string | null;
    receipt_number: string | null;
    created_at: string;
    timeline?: Array<{
        id: string;
        author: string;
        text: string;
        created_at: string;
    }>;
    user?: {
        id: number;
        name: string;
        email: string;
        initials: string;
        color: string;
        role?: string;
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
    const response = await api.get('/api/admin/cases');
    return response.data;
};

export const getManagerAssignedCases = async (): Promise<Application[]> => {
    const response = await api.get('/api/manager/assigned-cases');
    return response.data;
};

export const assignCaseManager = async (id: number, managerId: number | null): Promise<Application> => {
    const response = await api.put(`/api/admin/cases/${id}/assign`, { manager_id: managerId });
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
    const response = await api.get('/api/admin/assignment-requests', { params });
    return response.data;
};

export const getAssignmentRequest = async (id: number): Promise<AssignmentRequest> => {
    const response = await api.get(`/api/admin/assignment-requests/${id}`);
    return response.data;
};

export const updateAssignmentRequest = async (id: number, status: string): Promise<AssignmentRequest> => {
    const response = await api.put(`/api/admin/assignment-requests/${id}`, { status });
    return response.data.request;
};

export const updateCaseStatus = async (id: number, status: string): Promise<Application> => {
    const response = await api.put(`/api/admin/applications/${id}`, { status });
    return response.data;
};

export const updateApplication = async (
    id: number,
    payload: Partial<Pick<Application, 'status' | 'progress' | 'next_step' | 'timeline'>>
): Promise<Application> => {
    const response = await api.put(`/api/manager/applications/${id}`, payload);
    return response.data;
};

export const getManagerMessages = async (applicationId: number): Promise<MessagePayload[]> => {
    const response = await api.get(`/api/manager/applications/${applicationId}/messages`);
    return response.data;
};

export const sendManagerMessage = async (applicationId: number, message: string): Promise<MessagePayload> => {
    const response = await api.post(`/api/manager/applications/${applicationId}/messages`, { message });
    return response.data;
};

export const getManagerDocuments = async (applicationId: number): Promise<DocumentPayload[]> => {
    const response = await api.get(`/api/manager/applications/${applicationId}/documents`);
    return response.data;
};

export const requestManagerDocuments = async (applicationId: number, documents: string, note: string): Promise<{ request: any; application: Application }> => {
    const response = await api.post(`/api/manager/applications/${applicationId}/documents/requests`, { documents, note });
    return response.data;
};

export const escalateApplication = async (applicationId: number, reason: string): Promise<any> => {
    const response = await api.post(`/api/manager/applications/${applicationId}/escalate`, { reason });
    return response.data;
};
