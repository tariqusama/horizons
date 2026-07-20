import api from '../api';

export const getDashboardStats = async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response.data;
};

export const getRecentActivity = async () => {
    const response = await api.get('/api/admin/dashboard/activity');
    return response.data;
};

export const getAnalyticsData = async () => {
    const response = await api.get('/api/admin/analytics/data');
    return response.data;
};
