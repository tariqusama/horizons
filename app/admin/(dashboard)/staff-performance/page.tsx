"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUsers } from '../../../../lib/api/users';
import { getCases } from '@/lib/api/cases';

const TABS = ['Workload', 'Performance', 'Capacity Analysis', 'Leaderboard'] as const;
type Tab = (typeof TABS)[number];

const TOP_STATS = [
    {
        label: 'Total staff',
        value: '6',
        sub: '3 attorneys • 3 case managers',
        iconBg: '#E6F1FB',
        iconColor: '#185FA5',
        valueColor: '#101F38',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        label: 'Active cases',
        value: '46',
        sub: 'Across all staff members',
        iconBg: '#EAF3DE',
        iconColor: '#3B6D11',
        valueColor: '#3B6D11',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l3 8 4-16 3 8h4" />
            </svg>
        ),
    },
    {
        label: 'Avg capacity',
        value: '77%',
        sub: 'Team utilization rate',
        iconBg: '#EEEDFE',
        iconColor: '#534AB7',
        valueColor: '#534AB7',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
            </svg>
        ),
    },
    {
        label: 'Overloaded',
        value: '1',
        sub: 'Staff over 90% capacity',
        iconBg: '#FAEEDA',
        iconColor: '#BA7517',
        valueColor: '#BA7517',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
    },
];

const WORKLOAD_DATA = [
    { email: 'a@horizonpathways.com', cases: 6 },
    { email: 'b@horizonpathways.com', cases: 10 },
    { email: 'c@horizonpathways.com', cases: 7 },
    { email: 'd@horizonpathways.com', cases: 4 },
    { email: 'e@horizonpathways.com', cases: 9 },
    { email: 'f@horizonpathways.com', cases: 8 },
];

const CASES_BY_ROLE = [
    { role: 'Attorneys', value: 9 },
    { role: 'Case managers', value: 6 },
];
const CASES_BY_ROLE_MAX = 12;
const CASES_BY_ROLE_STEPS = [12, 9, 6, 3, 0];

const COMPLETION_TIME_BY_ROLE = [
    { role: 'Attorneys', value: 15 },
    { role: 'Case managers', value: 12 },
];
const COMPLETION_TIME_MAX = 16;
const COMPLETION_TIME_STEPS = [16, 12, 8, 4, 0];

const CAPACITY_DISTRIBUTION = [
    { label: 'Optimal (50-90%)', value: 3, color: '#33A853', textColor: '#27500A' },
    { label: 'Underutilized (<50%)', value: 2, color: '#F2A213', textColor: '#854F0B' },
    { label: 'Overloaded (>90%)', value: 1, color: '#101F38', textColor: '#101F38' },
];

type LeaderboardEntry = {
    rank: number;
    name: string;
    role: string;
    completed: number;
    active: number;
    avgDays: number;
    pct: number;
};

const LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: 'David Kim', role: 'case manager', completed: 55, active: 7, avgDays: 13, pct: 70 },
    { rank: 2, name: 'Emily Davis', role: 'case manager', completed: 52, active: 6, avgDays: 12, pct: 60 },
    { rank: 3, name: 'Alex Rodriguez', role: 'case manager', completed: 48, active: 4, avgDays: 11, pct: 40 },
    { rank: 4, name: 'Sarah Johnson', role: 'immigration attorney', completed: 45, active: 8, avgDays: 14, pct: 80 },
    { rank: 5, name: 'Lisa Wang', role: 'immigration attorney', completed: 42, active: 9, avgDays: 15, pct: 90 },
    { rank: 6, name: 'Mike Chen', role: 'immigration attorney', completed: 38, active: 12, avgDays: 16, pct: 120 },
];

const CHART_MAX = 12;
const CHART_STEPS = [12, 9, 6, 3, 0];

function WorkloadChart() {
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Staff workload distribution</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">Active cases per staff member</p>

            <div className="flex">
                <div className="flex flex-col justify-between text-xs text-[#5B6472] font-medium pr-3 pb-10" style={{ height: 260 }}>
                    {CHART_STEPS.map((step) => (
                        <span key={step}>{step}</span>
                    ))}
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height: 260 }}>
                        {CHART_STEPS.map((step) => (
                            <div key={step} className="border-t border-[#ECE9E2] w-full" />
                        ))}
                    </div>

                    <div className="relative flex items-end justify-between gap-4" style={{ height: 260 }}>
                        {WORKLOAD_DATA.map((staff) => (
                            <div key={staff.email} className="flex-1 flex flex-col items-center h-full justify-end">
                                <div
                                    className="w-full max-w-[64px] rounded-t-md"
                                    style={{
                                        height: `${(staff.cases / CHART_MAX) * 100}%`,
                                        background: 'linear-gradient(180deg, #E3755D 0%, #F6C6B8 100%)',
                                    }}
                                    title={`${staff.cases} cases`}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-start justify-between gap-4 mt-3">
                        {WORKLOAD_DATA.map((staff) => (
                            <div key={staff.email} className="flex-1 flex justify-center">
                                <span
                                    className="text-xs text-[#5B6472] font-medium whitespace-nowrap origin-top-left"
                                    style={{ transform: 'rotate(-40deg)', display: 'inline-block' }}
                                >
                                    {staff.email}
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
    max,
    steps,
    gradientFrom,
    gradientTo,
}: {
    title: string;
    subtitle: string;
    data: { role: string; value: number }[];
    max: number;
    steps: number[];
    gradientFrom: string;
    gradientTo: string;
}) {
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm flex-1">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">{title}</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">{subtitle}</p>

            <div className="flex">
                <div className="flex flex-col justify-between text-xs text-[#5B6472] font-medium pr-3 pb-6" style={{ height: 220 }}>
                    {steps.map((step) => (
                        <span key={step}>{step}</span>
                    ))}
                </div>

                <div className="flex-1 relative">
                    <div className="absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height: 220 }}>
                        {steps.map((step) => (
                            <div key={step} className="border-t border-[#ECE9E2] w-full" />
                        ))}
                    </div>

                    <div className="relative flex items-end justify-around gap-6" style={{ height: 220 }}>
                        {data.map((d) => (
                            <div key={d.role} className="flex-1 flex flex-col items-center h-full justify-end">
                                <div
                                    className="w-full max-w-[120px] rounded-t-md"
                                    style={{
                                        height: `${(d.value / max) * 100}%`,
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

function PerformanceSection() {
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <SimpleBarChart
                title="Average cases by role"
                subtitle="Current workload comparison"
                data={CASES_BY_ROLE}
                max={CASES_BY_ROLE_MAX}
                steps={CASES_BY_ROLE_STEPS}
                gradientFrom="#185FA5"
                gradientTo="#B5D4F4"
            />
            <SimpleBarChart
                title="Avg completion time"
                subtitle="Days to complete cases by role"
                data={COMPLETION_TIME_BY_ROLE}
                max={COMPLETION_TIME_MAX}
                steps={COMPLETION_TIME_STEPS}
                gradientFrom="#3B6D11"
                gradientTo="#C0DD97"
            />
        </div>
    );
}

function CapacityPieChart() {
    const total = CAPACITY_DISTRIBUTION.reduce((sum, d) => sum + d.value, 0);
    let cumulative = 0;
    const segments = CAPACITY_DISTRIBUTION.map((d) => {
        const start = (cumulative / total) * 360;
        cumulative += d.value;
        const end = (cumulative / total) * 360;
        return { ...d, start, end };
    });

    const gradient = segments
        .map((s) => `${s.color} ${s.start}deg ${s.end}deg`)
        .join(', ');

    return (
        <div
            className="w-56 h-56 rounded-full shrink-0"
            style={{ background: `conic-gradient(${gradient})` }}
        />
    );
}

function CapacitySection() {
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Capacity distribution</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-8">Staff workload balance</p>

            <div className="flex flex-col items-center gap-6">
                <CapacityPieChart />
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {CAPACITY_DISTRIBUTION.map((d) => (
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
            <span className="w-9 h-9 rounded-full bg-[#FBEAE4] text-[#E3755D] font-black text-sm flex items-center justify-center shrink-0">
                {entry.rank}
            </span>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold text-[#101F38]">{entry.name}</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#ECE9E2] text-[#5B6472]">
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
                            className="h-full rounded-full bg-[#E3755D]"
                            style={{ width: `${Math.min(entry.pct, 100)}%` }}
                        />
                    </div>
                    <span className="text-[11px] font-semibold text-[#E3755D] w-9 text-right">{entry.pct}%</span>
                </div>
            </div>
        </div>
    );
}

function LeaderboardSection() {
    return (
        <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#101F38] mb-1">Performance leaderboard</h2>
            <p className="text-sm text-[#5B6472] font-medium mb-6">Top performers by completed cases</p>

            <div className="flex flex-col gap-6">
                {LEADERBOARD.map((entry) => (
                    <LeaderboardRow key={entry.rank} entry={entry} />
                ))}
            </div>
        </div>
    );
}
export default function AdminStaffPerformancePage() {
    const [activeTab, setActiveTab] = useState<Tab>('Workload');
    const [users, setUsers] = useState<any[]>([]);
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [u, c] = await Promise.all([getUsers(), getCases()]);
                setUsers(u || []);
                setCases(c || []);
            } catch (err) {
                console.error('Failed to load staff performance data', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Staff performance</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Monitor team workload, capacity, and performance metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {TOP_STATS.map((stat) => (
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
                            {stat.label === 'Total staff' ? (users.length || stat.value) : stat.label === 'Active cases' ? (cases.length || stat.value) : stat.value}
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

            {activeTab === 'Workload' && <WorkloadChart />}
            {activeTab === 'Performance' && <PerformanceSection />}
            {activeTab === 'Capacity Analysis' && <CapacitySection />}
            {activeTab === 'Leaderboard' && <LeaderboardSection />}
        </div>
    );
}