import api from '../api';

export interface RevenueData {
    stats: {
        total_revenue: number;
        revenue_growth: number;
        active_subscriptions: number;
    };
    by_service: {
        service: string;
        revenue: number;
    }[];
    by_tier: {
        tier: string;
        revenue: number;
    }[];
}

export const getRevenueData = async (): Promise<RevenueData> => {
    const response = await api.get('/admin/revenue');
    return response.data;
};
