import api from '../api';

export interface Notification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        type: string;
        title: string;
        text: string;
        icon: string;
        color: string;
        bg: string;
    };
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
};

export const markAsRead = async (id?: string): Promise<void> => {
    await api.put('/notifications/mark-read', { id });
};
