import api from '../api';

export interface Ticket {
    id: number;
    ticket_id: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    user_id: number;
    assigned_to: number | null;
    created_at: string;
    user?: { id: number; name: string; email: string };
    assignee?: { id: number; name: string; email: string };
}

export const getTickets = async (): Promise<Ticket[]> => {
    const response = await api.get('/admin/tickets');
    return response.data;
};

export const assignTicket = async (id: number, managerId: number): Promise<Ticket> => {
    const response = await api.put(`/admin/tickets/${id}/assign`, { manager_id: managerId });
    return response.data.ticket;
};

export const updateTicketStatus = async (id: number, status: string): Promise<Ticket> => {
    const response = await api.put(`/admin/tickets/${id}/status`, { status });
    return response.data.ticket;
};

export const replyTicket = async (id: number, message: string): Promise<Ticket> => {
    const response = await api.post(`/admin/tickets/${id}/reply`, { message });
    return response.data.ticket;
};
