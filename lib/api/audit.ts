import api from '../api';

export interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    target: string | null;
    details: string | null;
    ip_address: string | null;
    created_at: string;
    user?: { id: number; name: string; email: string };
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
};
