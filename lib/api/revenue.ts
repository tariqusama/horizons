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
    monthly_revenue: {
        month: string;
        value: number;
    }[];
    recent_transactions: {
        id: string;
        title: string;
        plan: string;
        date: string;
        amount: string;
        status: 'Completed' | 'Pending' | 'Failed';
    }[];
    funnel_stats: {
        applications_created: number;
        payments_completed: number;
        pending_payments: number;
        conversion_rate: number;
    };
    leaderboard: {
        rank: number;
        name: string;
        role: string;
        completed: number;
        active: number;
        avg: string;
        percent: number;
    }[];
}

export const getRevenueData = async (): Promise<RevenueData> => {
    const response = await api.get('/admin/revenue', {
        params: { _t: new Date().getTime() }
    });
    return response.data;
};
