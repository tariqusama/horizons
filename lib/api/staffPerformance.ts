import api from '../api';

export type LeaderboardEntry = {
    id: number;
    rank: number;
    name: string;
    role: string;
    completed: number;
    active: number;
    avgDays: number;
    pct: number;
};

export type StaffPerformanceData = {
    topStats: {
        totalStaff: number;
        attorneysCount: number;
        caseManagersCount: number;
        activeCases: number;
        avgCapacity: number;
        overloaded: number;
    };
    workloadData: Array<{
        email: string;
        name: string;
        cases: number;
    }>;
    casesByRole: Array<{
        role: string;
        value: number;
    }>;
    completionTimeByRole: Array<{
        role: string;
        value: number;
    }>;
    capacityDistribution: Array<{
        label: string;
        value: number;
        color: string;
        textColor: string;
    }>;
    leaderboard: LeaderboardEntry[];
};

export const getStaffPerformance = async (): Promise<StaffPerformanceData> => {
    const response = await api.get('/admin/staff-performance/data');
    return response.data;
};
