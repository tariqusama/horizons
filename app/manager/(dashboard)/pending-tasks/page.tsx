"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getManagerAssignedCases, Application } from '@/lib/api/cases';

const TOP_STATS = [
    { label: 'Total pending', value: '--', sub: 'Assigned to you', bg: '#FBF1EA', labelColor: '#101F38', valueColor: '#E3755D', iconBg: '#FAEEDA', iconColor: '#BA7517', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>) },
    { label: 'Critical', value: '--', sub: 'Stalled >7 days', bg: '#FCEBEB', labelColor: '#101F38', valueColor: '#E24B4A', iconBg: '#F7C1C1', iconColor: '#A32D2D', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>) },
    { label: 'Avg progress', value: '--', sub: 'Across pending tasks', bg: '#EAF3DE', labelColor: '#101F38', valueColor: '#3B6D11', iconBg: '#C0DD97', iconColor: '#27500A', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>) },
];

type CaseItem = {
    id: number;
    caseName: string;
    caseType: 'Critical' | 'Paid' | 'Free';
    email: string;
    daysStuck: number;
    created: string;
    progressPct: number;
    status: 'Pending' | 'Paid' | 'Free';
};

type Group = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    highlight?: boolean;
    items: CaseItem[];
};

function StatusPill({ status }: { status: CaseItem['status'] }) {
    const styles: Record<CaseItem['status'], { bg: string; color: string }> = {
        Pending: { bg: '#FAEEDA', color: '#854F0B' },
        Paid: { bg: '#EAF3DE', color: '#3B6D11' },
        Free: { bg: '#F1EFE8', color: '#5F5E5A' },
    };
    const style = styles[status];
    return (
        <span
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: style.bg, color: style.color }}
        >
            {status}
        </span>
    );
}

function CaseRow({ item }: { item: CaseItem }) {
    return (
        <div className="rounded-2xl border border-[#ECE9E2] bg-white p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="text-sm font-bold text-[#101F38]">{item.caseName}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#E24B4A] text-white">
                            {item.caseType}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#5B6472] font-medium">
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                            {item.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                            {item.daysStuck} days stuck
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            Created {item.created}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={item.status} />
                    <Link href={`/manager/assigned-cases?caseId=${item.id}`} className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3.5 py-2 hover:bg-[#F7F5F0] transition-colors">
                        View
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <div className="h-1.5 flex-1 rounded-full bg-[#ECE9E2] overflow-hidden">
                    <div className="h-full rounded-full bg-[#E3755D]" style={{ width: `${item.progressPct}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-[#E3755D] w-8 text-right">{item.progressPct}%</span>
            </div>
        </div>
    );
}

function GroupSection({ group }: { group: Group }) {
    return (
        <div className={`rounded-3xl border bg-white p-6 shadow-sm ${group.highlight ? 'border-[#E3755D]' : 'border-[#ECE9E2]'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span style={{ color: group.iconColor }}>{group.icon}</span>
                    <div>
                        <h3 className="text-sm font-bold text-[#101F38]">{group.title}</h3>
                        <p className="text-xs text-[#5B6472] font-medium">{group.subtitle}</p>
                    </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F7F5F0] text-[#5B6472] shrink-0">{group.items.length} affected</span>
            </div>

            <div className="flex flex-col gap-3">
                {group.items.map((item, i) => (
                    <CaseRow key={`${item.caseName}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}

export default function ManagerPendingTasksPage() {
    const [cases, setCases] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Breached' | 'Critical'>('All');
    const [showAcknowledged, setShowAcknowledged] = useState(false);
    const [acknowledgedIds, setAcknowledgedIds] = useState<number[]>(() => {
        try {
            const raw = localStorage.getItem('pendingTasksAck');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getManagerAssignedCases();
                setCases(data);
            } catch (err) {
                console.error('Failed to load manager pending cases', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await getManagerAssignedCases();
            setCases(data);
        } catch (err) {
            console.error('Refresh failed', err);
        } finally {
            setLoading(false);
        }
    };

    const acknowledge = (id: number) => {
        const next = Array.from(new Set([...acknowledgedIds, id]));
        setAcknowledgedIds(next);
        try {
            localStorage.setItem('pendingTasksAck', JSON.stringify(next));
        } catch (e) {
            console.error('Unable to persist acknowledged ids', e);
        }
    };

    const toCaseItem = (c: Application): CaseItem => {
        const created = new Date(c.created_at);
        const daysStuck = Math.max(0, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
        let progressPct = 0;
        if (typeof (c as any).progress === 'number') progressPct = (c as any).progress;
        else if (typeof (c as any).progress === 'string') progressPct = parseInt(((c as any).progress || '0').replace('%', '')) || 0;

        return {
            id: c.id,
            caseName: c.title || `App #${c.id}`,
            caseType: progressPct >= 80 ? 'Critical' : 'Paid',
            email: c.user?.email || 'unknown@example.com',
            daysStuck,
            created: created.toLocaleDateString(),
            progressPct,
            status: c.status as CaseItem['status'] || 'Pending',
        };
    };

    const allItems = cases.map(toCaseItem);

    // derive SLA stats from assigned cases
    const breachedItems = allItems.filter(i => i.daysStuck > 14);
    const atRiskItems = allItems.filter(i => i.daysStuck > 7 && i.daysStuck <= 14);
    const onTrackItems = allItems.filter(i => i.daysStuck <= 7);
    const activeSLAItems = allItems.filter(i => i.daysStuck > 0);
    const slaOnTrackPct = allItems.length ? Math.round((onTrackItems.length / allItems.length) * 100) : 0;
    const slaAtRiskPct = allItems.length ? Math.round((atRiskItems.length / allItems.length) * 100) : 0;
    const slaBreachedPct = allItems.length ? Math.round((breachedItems.length / allItems.length) * 100) : 0;
    const avgResponseDays = allItems.length ? Math.round(allItems.reduce((s, i) => s + i.daysStuck, 0) / allItems.length) : 0;
    const slaAlerts = allItems.filter(i => i.daysStuck > 7 || i.progressPct < 20);

    const buildGroups = (): Group[] => {
        const paymentPending = allItems.filter(i => i.status === 'Pending' && i.progressPct < 50);
        const abandoned = allItems.filter(i => i.progressPct >= 10 && i.progressPct < 50 && i.daysStuck > 7);
        const notStarted = allItems.filter(i => i.progressPct <= 10 && i.daysStuck > 3);
        const almostComplete = allItems.filter(i => i.progressPct >= 75 && i.daysStuck > 3);
        const longInactive = allItems.filter(i => i.daysStuck > 14);

        return [
            { title: 'Payment pending', subtitle: "Users who created applications but haven't completed payment", iconColor: '#BA7517', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>), items: paymentPending },
            { title: 'Abandoned mid-process', subtitle: 'Started but stopped partway through', iconColor: '#185FA5', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>), items: abandoned },
            { title: 'Not started', subtitle: 'Application created but intake not begun', iconColor: '#5F5E5A', highlight: true, icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></svg>), items: notStarted },
            { title: 'Almost complete', subtitle: 'Near completion but stalled', iconColor: '#3B6D11', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>), items: almostComplete },
            { title: 'Long inactive', subtitle: 'No activity for over two weeks', iconColor: '#A32D2D', icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>), items: longInactive },
        ];
    };

    const groupsToRender = buildGroups();

    const displayedActiveItems = activeSLAItems.filter((it) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Breached') return it.daysStuck > 14;
        if (activeFilter === 'Critical') return it.caseType === 'Critical' || it.progressPct >= 80;
        return true;
    });

    const displayedAlerts = slaAlerts.filter((a) => (showAcknowledged ? true : !acknowledgedIds.includes(a.id)));

    const avgProgress = allItems.length ? Math.round(allItems.reduce((s, i) => s + i.progressPct, 0) / allItems.length) : 0;
    TOP_STATS[0].value = String(allItems.length);
    TOP_STATS[1].value = String(allItems.filter(i => i.daysStuck > 7).length);
    TOP_STATS[2].value = `${avgProgress}%`;

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Pending Tasks</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Your assigned tasks that require attention</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {TOP_STATS.map((stat) => (
                    <div key={stat.label} className="rounded-3xl p-6" style={{ backgroundColor: stat.bg }}>
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-semibold" style={{ color: stat.labelColor }}>{stat.label}</span>
                            <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-black mb-1 tracking-tight" style={{ color: stat.valueColor }}>{stat.value}</p>
                        <p className="text-xs text-[#5B6472] font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* SLA Monitor section (cards + performance monitor + active tracking) */}
            <div className="mt-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#101F38]">SLA Monitor</h2>
                    <div className="text-sm text-[#5B6472]">Sign Out</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2]">
                        <p className="text-xs text-[#5B6472]">On Track</p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-black">{slaOnTrackPct}%</p>
                            <div className="text-green-500">✓</div>
                        </div>
                        <p className="text-xs text-[#9AA0A8] mt-1">Within SLA limits</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2]">
                        <p className="text-xs text-[#5B6472]">At Risk</p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-black">{slaAtRiskPct}%</p>
                            <div className="text-orange-500">⏱</div>
                        </div>
                        <p className="text-xs text-[#9AA0A8] mt-1">Approaching deadline</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2]">
                        <p className="text-xs text-[#5B6472]">Breached</p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-black">{slaBreachedPct}%</p>
                            <div className="text-red-500">⚠</div>
                        </div>
                        <p className="text-xs text-[#9AA0A8] mt-1">Past deadline</p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 border border-[#ECE9E2]">
                        <p className="text-xs text-[#5B6472]">Avg Response</p>
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-2xl font-black">{avgResponseDays} days</p>
                            <div className="text-orange-400">↗</div>
                        </div>
                        <p className="text-xs text-[#9AA0A8] mt-1">avg days since creation</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6 mb-6">
                    <h3 className="text-sm font-bold text-[#101F38] mb-4">SLA Performance Monitor</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="rounded-xl p-4 border border-[#F1F1F1]">
                            <p className="text-xs text-[#5B6472]">SLA Health</p>
                            <p className="text-lg font-black mt-2">0%</p>
                            <div className="h-2 bg-[#EAF0FB] rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-[#CFE0FF] w-1/4" />
                            </div>
                        </div>
                        <div className="rounded-xl p-4 border border-[#F1F1F1]">
                            <p className="text-xs text-[#5B6472]">Breached</p>
                            <p className="text-lg font-black mt-2">0</p>
                        </div>
                        <div className="rounded-xl p-4 border border-[#F1F1F1]">
                            <p className="text-xs text-[#5B6472]">Critical</p>
                            <p className="text-lg font-black mt-2">0</p>
                        </div>
                        <div className="rounded-xl p-4 border border-[#F1F1F1]">
                            <p className="text-xs text-[#5B6472]">Warning</p>
                            <p className="text-lg font-black mt-2">0</p>
                        </div>
                        <div className="rounded-xl p-4 border border-[#F1F1F1]">
                            <p className="text-xs text-[#5B6472]">On Track</p>
                            <p className="text-lg font-black mt-2">0</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-[#ECE9E2] p-6 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-bold text-[#101F38]">Active SLA Tracking</p>
                                <p className="text-xs text-[#9AA0A8]">{activeSLAItems.length} active item(s)</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className={`px-3 py-1 rounded-full text-xs ${activeFilter === 'All' ? 'bg-[#FF6A3D] text-white' : 'border border-[#ECE9E2]'}`}
                                    onClick={() => setActiveFilter('All')}
                                >
                                    All
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full text-xs ${activeFilter === 'Breached' ? 'bg-[#FF6A3D] text-white' : 'border border-[#ECE9E2]'}`}
                                    onClick={() => setActiveFilter('Breached')}
                                >
                                    Breached
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full text-xs ${activeFilter === 'Critical' ? 'bg-[#FF6A3D] text-white' : 'border border-[#ECE9E2]'}`}
                                    onClick={() => setActiveFilter('Critical')}
                                >
                                    Critical
                                </button>
                                <button className="px-3 py-1 rounded-full border border-[#ECE9E2] text-xs" onClick={refresh}>Refresh</button>
                            </div>
                        </div>

                        <div className="h-48">
                            {activeSLAItems.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-[#9AA0A8]">
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-full border border-[#ECE9E2] mx-auto flex items-center justify-center mb-3">✓</div>
                                        <p className="font-semibold">No active SLA items</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {displayedActiveItems.map((it, idx) => (
                                        <div key={`active-${idx}`} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <p className="font-semibold text-sm">{it.caseName}</p>
                                                <p className="text-xs text-[#9AA0A8]">{it.email} • {it.daysStuck} days</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-semibold text-[#E3755D]">{it.progressPct}%</div>
                                                <Link href={`/manager/assigned-cases?caseId=${it.id}`} className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3 py-1 hover:bg-[#F7F5F0]">View</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SLA Alerts section */}
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-[#101F38] mb-2">SLA Alerts</h3>
                        <p className="text-xs text-[#9AA0A8] mb-4">Cases requiring immediate attention</p>

                        <div className="rounded-2xl border border-[#ECE9E2] bg-white p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                    <p className="font-bold text-sm text-[#101F38]">SLA Alerts</p>
                                </div>
                                <button
                                    className={`px-3 py-1 rounded-full text-xs ${showAcknowledged ? 'bg-[#FF6A3D] text-white' : 'border border-[#ECE9E2]'}`}
                                    onClick={() => setShowAcknowledged((s) => !s)}
                                >
                                    Show Acknowledged
                                </button>
                            </div>

                            <div className="h-48">
                                {slaAlerts.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-[#9AA0A8]">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full border border-[#ECE9E2] mx-auto flex items-center justify-center mb-3">🔔</div>
                                            <p className="font-semibold">No unacknowledged alerts</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {displayedAlerts.map((a, i) => (
                                            <div key={`alert-${i}`} className="p-3 rounded-lg border flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">{a.caseName}</p>
                                                    <p className="text-xs text-[#9AA0A8]">{a.email} • {a.daysStuck} days</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!acknowledgedIds.includes(a.id) ? (
                                                        <button onClick={() => acknowledge(a.id)} className="px-3 py-1 rounded-full border border-[#ECE9E2] text-xs">Acknowledge</button>
                                                    ) : (
                                                        <span className="text-sm text-green-600 font-semibold">Acknowledged</span>
                                                    )}
                                                    <Link href={`/manager/assigned-cases?caseId=${a.id}`} className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3 py-1 hover:bg-[#F7F5F0]">View</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="text-sm text-[#5B6472]">Loading pending tasks...</div>
                ) : (
                    groupsToRender.map((group) => (
                        <GroupSection key={group.title} group={group} />
                    ))
                )}
            </div>
        </div>
    );
}
