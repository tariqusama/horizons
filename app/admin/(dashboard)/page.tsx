'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getDashboardStats, getRecentActivity } from '../../../lib/api/analytics';

/* ---------- Small inline icon set ---------- */
const Icon = {
    people2: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" /><circle cx="18" cy="8" r="2.5" /></svg>,
    document: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    bulb: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>,
    alert: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    book: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    assignment: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21 12 17.5 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
    role: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="9" r="3.5" /><path d="M2.5 20a6 6 0 0 1 12 0" /><circle cx="18" cy="7" r="2.2" /><path d="M15.5 13.5a4.2 4.2 0 0 1 6.5 3.5" /></svg>,
    revenue: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    team: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    service: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    gear: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    caseAssign: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 8v6M19 11h6" /></svg>,
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    audit: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 8 12 12 14.5 14" /></svg>,
    analytics: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6.5 3.8" /></svg>,
};

function Sparkline({ color, points }: { color: string; points: number[] }) {
    const w = 84, h = 28;
    const max = Math.max(...points), min = Math.min(...points);
    const range = max - min || 1;
    const step = w / (points.length - 1);
    const d = points
        .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - ((v - min) / range) * h}`)
        .join(' ');
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
            <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

const stats = [
    { label: 'Total Users', value: '36', delta: '+500% from last month', bg: '#FBE3D0', fg: '#B85B1E', icon: Icon.people2, spark: [4, 6, 5, 9, 12, 20, 36], sparkColor: '#3F9A73' },
    { label: 'Active Cases', value: '23', delta: '+100% from last month', bg: '#D7F1E1', fg: '#2F8A5F', icon: Icon.document, spark: [3, 4, 6, 8, 12, 18, 23], sparkColor: '#3F9A73' },
    { label: 'Pending Requests', value: '0', delta: '+0% from last month', bg: '#E5DFF9', fg: '#6B4FBB', icon: Icon.shield, spark: [1, 1, 1, 0, 1, 0, 0], sparkColor: '#6B4FBB' },
    { label: 'Revenue (MTD)', value: '$0', delta: '+0% from last month', bg: '#FBF0C9', fg: '#B98A0A', icon: Icon.bulb, spark: [0, 0, 0, 0, 0, 0, 0], sparkColor: '#B98A0A' },
];

const quickActionsLeft = [
    { title: 'Control Center', desc: 'Global oversight, system health, notifications, and RBAC', icon: Icon.shield, href: '/admin/control-center', bg: '#E1F2D9', fg: '#5A9A2F' },
    { title: 'Stuck Applications', desc: 'Applications that need attention and follow-up', icon: Icon.alert, href: '/admin/stuck-applications', bg: '#FBE1E1', fg: '#D64545' },
    { title: 'Guide Engine', desc: 'Manage USCIS forms, lockbox addresses, and fee tracking', icon: Icon.book, href: '/admin/guide-engine', bg: '#FBEFD1', fg: '#B98A0A' },
    { title: 'Assignment Requests', desc: 'Review and act on pending staff assignment requests', icon: Icon.assignment, href: '/admin/assignment-requests', bg: '#DCEBFB', fg: '#2F6FB3' },
    { title: 'Role Management', desc: 'Manage user roles and permissions', icon: Icon.role, href: '/admin/roles', bg: '#E1F2D9', fg: '#5A9A2F' },
];

const quickActionsRight = [
    { title: 'Revenue Dashboard', desc: 'Comprehensive revenue analytics and payment insights', icon: Icon.revenue, href: '/admin/revenue', bg: '#FBEFD1', fg: '#B98A0A' },
    { title: 'Staff Performance', desc: 'Team workload, capacity, and performance tracking', icon: Icon.team, href: '/admin/staff-performance', bg: '#DCEBFB', fg: '#2F6FB3' },
    { title: 'Service & Pricing', desc: 'Manage services, pricing tiers, and bundle configuration', icon: Icon.service, href: '/admin/service-pricing', bg: '#E8E7E3', fg: '#5B6472' },
    { title: 'User Management', desc: 'View and manage all users in the system', icon: Icon.gear, href: '/admin/users', bg: '#E5DFF9', fg: '#6B4FBB' },
    { title: 'Case Assignments', desc: "Assign clients' cases to specific case managers", icon: Icon.caseAssign, href: '/admin/case-assignments', bg: '#E1F2D9', fg: '#5A9A2F' },
];

const sideQuickActions = [
    { label: 'Global Search', icon: Icon.search, fg: '#2F6FB3', href: '/admin/search' },
    { label: 'User & Roles', icon: Icon.users, fg: '#B85B1E', href: '/admin/roles' },
    { label: 'Audit Logs', icon: Icon.audit, fg: '#B85B1E', href: '/admin/audit-logs' },
    { label: 'Analytics', icon: Icon.analytics, fg: '#B98A0A', href: '/admin/analytics' },
    { label: 'Control Center', icon: Icon.shield, fg: '#5A9A2F', href: '/admin/control-center' },
    { label: 'Stuck Applications', icon: Icon.alert, fg: '#D64545', href: '/admin/stuck-applications' },
    { label: 'Guide Engine', icon: Icon.book, fg: '#B98A0A', href: '/admin/guide-engine' },
    { label: 'Assignment Requests', icon: Icon.assignment, fg: '#2F6FB3', href: '/admin/assignment-requests' },
    { label: 'Role Management', icon: Icon.role, fg: '#5A9A2F', href: '/admin/roles' },
    { label: 'Revenue Dashboard', icon: Icon.revenue, fg: '#B98A0A', href: '/admin/revenue' },
    { label: 'Staff Performance', icon: Icon.team, fg: '#2F6FB3', href: '/admin/staff-performance' },
    { label: 'Service & Pricing', icon: Icon.service, fg: '#5B6472', href: '/admin/service-pricing' },
    { label: 'User Management', icon: Icon.gear, fg: '#6B4FBB', href: '/admin/users' },
    { label: 'Case Assignments', icon: Icon.caseAssign, fg: '#5A9A2F', href: '/admin/case-assignments' },
];

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [stats, recentActivities] = await Promise.all([
                    getDashboardStats(),
                    getRecentActivity()
                ]);
                setStatsData(stats);
                setActivities(recentActivities);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = statsData ? [
        { label: 'Total Users', value: statsData.users.count.toString(), delta: 'Live DB count', bg: '#FBE3D0', fg: '#B85B1E', icon: Icon.people2, spark: statsData.users.sparkline, sparkColor: '#3F9A73' },
        { label: 'Active Cases', value: statsData.cases.count.toString(), delta: 'Live DB count', bg: '#DDF3E4', fg: '#2F8A5F', icon: Icon.document, spark: statsData.cases.sparkline, sparkColor: '#3F9A73' },
        { label: 'Total Revenue', value: '$' + Number(statsData.revenue.total).toLocaleString(undefined, { minimumFractionDigits: 2 }), delta: 'Live DB count', bg: '#FBEFD1', fg: '#B98A0A', icon: Icon.revenue, spark: statsData.revenue.sparkline, sparkColor: '#3F9A73' },
        { label: 'Open Tickets', value: statsData.tickets.open.toString(), delta: 'Live DB count', bg: '#FBE1E6', fg: '#D6497A', icon: Icon.alert, spark: statsData.tickets.sparkline, sparkColor: '#D6497A' },
    ] : [];

    return (
        <div className="max-w-[1400px] mx-auto w-full">
            {/* Welcome banner */}
            <div
                className="relative overflow-hidden rounded-2xl px-8 py-7 mb-6"
                style={{ background: 'linear-gradient(120deg, #EAE6F7 0%, #E6EEF9 55%, #EAF6FF 100%)' }}
            >
                <h1 className="text-2xl md:text-[26px] font-black text-[#101F38] tracking-tight">Welcome to Horizon Pathways</h1>
                <p className="text-[#5B6472] mt-2 font-medium max-w-2xl text-sm">
                    Monitor your data protection compliance status, manage assessments, and track risk mitigation progress.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: s.bg }}>
                        <div className="flex items-center gap-2 mb-4">
                            <s.icon width={15} height={15} style={{ color: s.fg }} />
                            <span className="text-sm font-semibold" style={{ color: s.fg }}>{s.label}</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-2xl font-black text-[#101F38]">{s.value}</p>
                                <p className="text-[11px] font-semibold mt-1" style={{ color: s.fg }}>{s.delta}</p>
                            </div>
                            <Sparkline color={s.sparkColor} points={s.spark} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6">
                    <h2 className="font-bold text-[#101F38] text-lg mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...quickActionsLeft.map((a, i) => ({ ...a, col: 0, i })), ...quickActionsRight.map((a, i) => ({ ...a, col: 1, i }))]
                            .sort((a, b) => a.i - b.i || a.col - b.col)
                            .map((action, idx) => (
                                <Link
                                    key={idx}
                                    href={action.href || '#'}
                                    className="flex items-start gap-3 p-4 rounded-xl border border-[#ECE9E2] hover:border-[#E3755D]/40 hover:shadow-sm transition-all text-left"
                                >
                                    <span
                                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: action.bg, color: action.fg }}
                                    >
                                        <action.icon width={17} height={17} />
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold" style={{ color: action.fg }}>{action.title}</span>
                                        <span className="block text-xs text-[#5B6472] mt-0.5 leading-snug">{action.desc}</span>
                                    </span>
                                </Link>
                            ))}
                    </div>
                    <div className="mt-8">
                        <h2 className="font-bold text-[#101F38] text-lg mb-5">Recent Activity</h2>
                        <div className="space-y-6">
                            {activities.length === 0 && <div className="text-gray-500 text-sm">No recent activity.</div>}
                            {activities.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full bg-[#F5F4F1] text-[#1B3A64] shrink-0 flex items-center justify-center`}>
                                        <Icon.audit width={18} height={18} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-bold">{item.user}</span> {item.action} <span className="font-semibold text-gray-700">{item.target}</span>
                                        </p>
                                        <p className="text-xs font-semibold text-gray-500 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-[#EDEAF4] rounded-2xl p-6 h-fit">
                    <h2 className="font-bold text-[#101F38] text-lg mb-5">Quick Actions</h2>
                    <div className="space-y-2">
                        {sideQuickActions.map((a) => (
                            <button
                                key={a.label}
                                type="button"
                                onClick={() => a.href && router.push(a.href)}
                                aria-label={a.label}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white hover:shadow-sm transition-all text-left"
                            >
                                <a.icon width={15} height={15} style={{ color: a.fg }} />
                                <span className="text-sm font-semibold" style={{ color: a.fg }}>{a.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}