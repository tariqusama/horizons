"use client";

import { useEffect, useState } from 'react';
import { getStaffPerformance, StaffPerformanceData, LeaderboardEntry } from '../../../../lib/api/staffPerformance';

const TABS = ['Workload', 'Performance', 'Capacity Analysis', 'Leaderboard'] as const;
type Tab = (typeof TABS)[number];

// Reusable basic SVG Icons
const Icon = {
    staff: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    cases: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h4l3 8 4-16 3 8h4" />
        </svg>
    ),
    capacity: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    overloaded: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    )
};

function WorkloadChart({ data }: { data: StaffPerformanceData['workloadData'] }) {
    const maxVal = Math.max(12, ...data.map(d => d.cases));
    const CHART_STEPS = [maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0];

    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Staff workload distribution</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">Active cases per staff member</p>

            <div className="flex">
                <div className="flex flex-col justify-between text-xs text-[#5B6472] font-medium pr-3 pb-10" style={{ height: 260 }}>
                    {CHART_STEPS.map((step, i) => (
                        <span key={i}>{step}</span>
                    ))}
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height: 260 }}>
                        {CHART_STEPS.map((_, i) => (
                            <div key={i} className="border-t border-[#ECE9E2] w-full" />
                        ))}
                    </div>

                    <div className="relative flex items-end justify-between gap-4" style={{ height: 260 }}>
                        {data.map((staff) => (
                            <div key={staff.email} className="flex-1 flex flex-col items-center h-full justify-end">
                                <div
                                    className="w-full max-w-[64px] rounded-t-md transition-all duration-500"
                                    style={{
                                        height: `${maxVal > 0 ? (staff.cases / maxVal) * 100 : 0}%`,
                                        background: 'linear-gradient(180deg, #E3755D 0%, #F6C6B8 100%)',
                                    }}
                                    title={`${staff.cases} cases`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-start justify-between gap-4 mt-3">
                        {data.map((staff) => (
                            <div key={staff.email} className="flex-1 flex justify-center">
                                <span
                                    className="text-[10px] sm:text-xs text-[#5B6472] font-medium whitespace-nowrap origin-top-left"
                                    style={{ transform: 'rotate(-40deg)', display: 'inline-block' }}
                                    title={staff.email}
                                >
                                    {staff.name.split(' ')[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SimpleBarChart({
    title,
    subtitle,
    data,
    gradientFrom,
    gradientTo,
    fallbackMax = 12
}: {
    title: string;
    subtitle: string;
    data: { role: string; value: number }[];
    gradientFrom: string;
    gradientTo: string;
    fallbackMax?: number;
}) {
    const maxVal = Math.max(fallbackMax, ...data.map(d => d.value));
    const steps = [maxVal, Math.round(maxVal*0.75), Math.round(maxVal*0.5), Math.round(maxVal*0.25), 0];

    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm flex-1">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">{title}</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">{subtitle}</p>

            <div className="flex">
                <div className="flex flex-col justify-between text-xs text-[#5B6472] font-medium pr-3 pb-6" style={{ height: 220 }}>
                    {steps.map((step, i) => (
                        <span key={i}>{step}</span>
                    ))}
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height: 220 }}>
                        {steps.map((_, i) => (
                            <div key={i} className="border-t border-[#ECE9E2] w-full" />
                        ))}
                    </div>

                    <div className="relative flex items-end justify-around gap-6" style={{ height: 220 }}>
                        {data.map((d) => (
                            <div key={d.role} className="flex-1 flex flex-col items-center h-full justify-end">
                                <div
                                    className="w-full max-w-[120px] rounded-t-md transition-all duration-500"
                                    style={{
                                        height: `${maxVal > 0 ? (d.value / maxVal) * 100 : 0}%`,
                                        background: `linear-gradient(180deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                                    }}
                                    title={`${d.value}`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-around gap-6 mt-3">
                        {data.map((d) => (
                            <span key={d.role} className="flex-1 text-center text-xs text-[#5B6472] font-medium">
                                {d.role}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PerformanceSection({ data }: { data: StaffPerformanceData }) {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <SimpleBarChart
                title="Active cases by role"
                subtitle="Current workload comparison"
                data={data.casesByRole}
                gradientFrom="#185FA5"
                gradientTo="#B5D4F4"
            />
            <SimpleBarChart
                title="Avg completion time"
                subtitle="Days to complete cases by role"
                data={data.completionTimeByRole}
                gradientFrom="#3B6D11"
                gradientTo="#C0DD97"
                fallbackMax={16}
            />
        </div>
    );
}

function CapacityPieChart({ data }: { data: StaffPerformanceData['capacityDistribution'] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const segments = data.map((d) => {
        const start = total > 0 ? (cumulative / total) * 360 : 0;
        cumulative += d.value;
        const end = total > 0 ? (cumulative / total) * 360 : 0;
        return { ...d, start, end };
    });

    const gradient = segments
        .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
        .join(', ');

    return (
        <div
            className="w-56 h-56 rounded-full shrink-0"
            style={{ background: total > 0 ? `conic-gradient(${gradient})` : '#ECE9E2' }}
        />
    );
}

function CapacitySection({ data }: { data: StaffPerformanceData['capacityDistribution'] }) {
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Capacity distribution</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">Staff workload balance</p>

            <div className="flex flex-col items-center gap-6">
                <CapacityPieChart data={data} />
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {data.map((d) => (
                        <div key={d.label} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                            <span className="text-xs font-semibold" style={{ color: d.textColor }}>
                                {d.label}: {d.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
    return (
        <div className="flex items-center gap-4">
            <span className="w-9 h-9 rounded-full bg-[#FBEAE4] text-orange-500 font-black text-sm flex items-center justify-center shrink-0">
                {entry.rank}
            </span>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold text-[#101F38]">{entry.name}</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#ECE9E2] text-[#5B6472] capitalize">
                        {entry.role}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#5B6472] font-medium mb-2">
                    <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {entry.completed} completed
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12h4l3 8 4-16 3 8h4" />
                        </svg>
                        {entry.active} active
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                        {entry.avgDays}d avg
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-[#ECE9E2] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-b from-orange-500 to-orange-600"
                            style={{ width: `${Math.min(entry.pct, 100)}%` }}
                        />
                    </div>
                    <span className="text-[11px] font-semibold text-orange-500 w-9 text-right">{entry.pct}%</span>
                </div>
            </div>
        </div>
    );
}

function LeaderboardSection({ data }: { data: LeaderboardEntry[] }) {
    if (data.length === 0) {
        return (
            <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm text-center">
                <p className="text-sm text-[#5B6472] py-8">No leaderboard data available yet.</p>
            </div>
        );
    }
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Performance leaderboard</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-6">Top performers by completed cases</p>

            <div className="flex flex-col gap-6">
                {data.map((entry) => (
                    <LeaderboardRow key={entry.id} entry={entry} />
                ))}
            </div>
        </div>
    );
}

export default function AdminStaffPerformancePage() {
    const [activeTab, setActiveTab] = useState<Tab>('Workload');
    const [data, setData] = useState<StaffPerformanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getStaffPerformance();
                setData(res);
            } catch (err) {
                console.error('Failed to load staff performance data', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading || !data) {
        return (
            <div className="max-w-[1200px] mx-auto w-full pb-12 flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium text-sm">Loading performance metrics...</p>
                </div>
            </div>
        );
    }

    const topStats = [
        {
            label: 'Total staff',
            value: data.topStats.totalStaff.toString(),
            sub: `${data.topStats.attorneysCount} attorneys • ${data.topStats.caseManagersCount} case managers`,
            iconBg: '#E6F1FB',
            iconColor: '#185FA5',
            valueColor: '#101F38',
            icon: Icon.staff,
        },
        {
            label: 'Active cases',
            value: data.topStats.activeCases.toString(),
            sub: 'Across all staff members',
            iconBg: '#EAF3DE',
            iconColor: '#3B6D11',
            valueColor: '#3B6D11',
            icon: Icon.cases,
        },
        {
            label: 'Avg capacity',
            value: `${data.topStats.avgCapacity}%`,
            sub: 'Team utilization rate',
            iconBg: '#EEEDFE',
            iconColor: '#534AB7',
            valueColor: '#534AB7',
            icon: Icon.capacity,
        },
        {
            label: 'Overloaded',
            value: data.topStats.overloaded.toString(),
            sub: 'Staff over 90% capacity',
            iconBg: '#FAEEDA',
            iconColor: '#BA7517',
            valueColor: '#BA7517',
            icon: Icon.overloaded,
        },
    ];

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Staff performance</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Monitor team workload, capacity, and performance metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {topStats.map((stat) => (
                    <div key={stat.label} className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-semibold text-[#101F38]">{stat.label}</span>
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
                            >
                                {stat.icon}
                            </span>
                        </div>
                        <p className="text-3xl font-black mb-1 tracking-tight" style={{ color: stat.valueColor }}>
                            {stat.value}
                        </p>
                        <p className="text-xs text-[#5B6472] font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-1 rounded-full border border-[#ECE9E2] bg-white p-1 mb-8 w-full md:w-fit overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab
                            ? 'bg-[#F7F5F0] text-[#101F38]'
                            : 'text-[#5B6472] hover:text-[#101F38]'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Workload' && <WorkloadChart data={data.workloadData} />}
            {activeTab === 'Performance' && <PerformanceSection data={data} />}
            {activeTab === 'Capacity Analysis' && <CapacitySection data={data.capacityDistribution} />}
            {activeTab === 'Leaderboard' && <LeaderboardSection data={data.leaderboard} />}
        </div>
    );
}