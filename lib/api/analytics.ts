import api from '../api';

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
};

export const getRecentActivity = async () => {
    const response = await api.get('/admin/dashboard/activity');
    return response.data;
};

export const getAnalyticsData = async () => {
    const response = await api.get('/admin/analytics/data');
    return response.data;
};
