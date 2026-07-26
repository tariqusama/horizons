'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { getRevenueData, RevenueData } from '../../../../lib/api/revenue';

const Icon = {
    dollar: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    receipt: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 1V2z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="16" y2="11" /></svg>,
    hash: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>,
    percent: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>,
    refresh: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    trend: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
};

type TxStatus = 'Completed' | 'Pending' | 'Failed';

interface Transaction {
    id: string;
    /** Service name, e.g. "Green Card Renewal" — used to group the "By Service" chart */
    title: string;
    /** Pricing tier, e.g. "Advanced Plan" — used to group the "By Tier" chart */
    plan: string;
    date: string;
    /** Raw dollar amount, e.g. "$789.99" */
    amount: string;
    status: TxStatus;
}

// We will dynamically fetch these from the API instead of using static arrays.
// Constants removed.

const COLOR_PALETTE = ['#2F8A5F', '#3A6FC4', '#C97A2B', '#7C5CBF', '#D6497A', '#B98A0A', '#5B6472'];

/** Aggregates dollar revenue across transactions by an arbitrary key (service name or tier), returning % share sorted descending. */
function aggregateRevenueShare(transactions: Transaction[], keyFn: (t: Transaction) => string) {
    const totals = new Map<string, number>();
    for (const t of transactions) {
        const key = keyFn(t);
        const amount = parseFloat(t.amount.replace(/[$,]/g, '')) || 0;
        totals.set(key, (totals.get(key) || 0) + amount);
    }
    const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0);
    return Array.from(totals.entries())
        .map(([name, amount]) => ({ name, amount, value: grandTotal > 0 ? Math.round((amount / grandTotal) * 1000) / 10 : 0 }))
        .sort((a, b) => b.value - a.value)
        .map((d, i) => ({ ...d, color: COLOR_PALETTE[i % COLOR_PALETTE.length] }));
}

const TABS = ['Revenue Trends', 'By Service', 'By Tier', 'Conversion Funnel'] as const;
type Tab = typeof TABS[number];

const StatusBadge = ({ status }: { status: TxStatus }) => {
    const styles: Record<TxStatus, string> = {
        Completed: 'bg-[#DDF3E4] text-[#2F8A5F]',
        Pending: 'bg-[#FBEFD1] text-[#B98A0A]',
        Failed: 'bg-[#FBE1E1] text-[#D64545]',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

/* ---------- Revenue Trends: line/area chart, with a graceful single-point fallback ---------- */
function RevenueChart({ data }: { data: { month: string; value: number }[] }) {
    const w = 1000, h = 220, pad = 32;

    if (data.length === 0) return <ChartEmptyState message="No revenue recorded yet" />;

    if (data.length === 1) {
        const barW = 96;
        return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] overflow-visible">
                <line x1={pad} x2={w - pad} y1={h - pad} y2={h - pad} stroke="#ECE9E2" strokeWidth="1" />
                <rect x={w / 2 - barW / 2} y={pad} width={barW} height={h - pad * 2} rx="10" fill="url(#revFillSolid)" />
                <defs>
                    <linearGradient id="revFillSolid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                </defs>
                <text x={w / 2} y={pad - 10} textAnchor="middle" fontSize="15" fontWeight="800" fill="#101F38">
                    ${data[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </text>
                <text x={w / 2} y={h - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#8A8F98">
                    {data[0].month}
                </text>
            </svg>
        );
    }

    const max = Math.max(...data.map(d => d.value));
    const range = max || 1;
    const step = (w - pad * 2) / (data.length - 1);
    const points = data.map((d, i) => ({ x: pad + i * step, y: h - pad - (d.value / range) * (h - pad * 1.5) }));
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const area = `${line} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px] overflow-visible">
            <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </linearGradient>
            </defs>
            {[0, 1, 2, 3].map(i => (
                <line key={i} x1={pad} x2={w - pad} y1={pad + (i * (h - pad * 1.5)) / 3} y2={pad + (i * (h - pad * 1.5)) / 3} stroke="#ECE9E2" strokeWidth="1" />
            ))}
            <path d={area} fill="url(#revFill)" />
            <path d={line} fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#ea580c" strokeWidth="2.5" />)}
            {data.map((d, i) => (
                <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#8A8F98">{d.month}</text>
            ))}
        </svg>
    );
}

/* ---------- By Service: ranked horizontal bars, grouped by trx.title, only categories with revenue ---------- */
function ServiceBreakdown({ byService }: { byService: { service: string; revenue: number }[] }) {
    if (!byService || byService.length === 0) return <ChartEmptyState message="No service revenue recorded yet" />;

    const total = byService.reduce((acc, curr) => acc + curr.revenue, 0);

    const active = byService
        .map(b => ({
            name: b.service,
            value: total > 0 ? Number(((b.revenue / total) * 100).toFixed(1)) : 0,
            color: '#101F38',
        }))
        .filter(d => d.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((d, i) => ({ ...d, color: COLOR_PALETTE[i % COLOR_PALETTE.length] }));

    return (
        <div className="flex flex-col gap-5 py-4 max-w-2xl mx-auto">
            {active.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="w-44 text-right text-sm font-bold text-[#101F38] truncate shrink-0">{s.name}</div>
                    <div className="flex-1 h-3 bg-[#F5F4F1] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${s.value}%`, backgroundColor: s.color }}></div>
                    </div>
                    <div className="w-14 text-sm font-semibold text-[#5B6472] shrink-0">{s.value}%</div>
                </div>
            ))}
        </div>
    );
}

function TierDonut({ byTier }: { byTier: { tier: string; revenue: number }[] }) {
    if (!byTier || byTier.length === 0) return <ChartEmptyState message="No tier revenue recorded yet" />;

    const total = byTier.reduce((acc, curr) => acc + curr.revenue, 0);

    const active = byTier
        .map(b => ({
            name: b.tier,
            value: total > 0 ? Number(((b.revenue / total) * 100).toFixed(1)) : 0,
            color: b.tier === 'Premium' ? '#f97316' : '#101F38',
        }))
        .filter(d => d.value > 0);

    if (active.length === 0) return <ChartEmptyState message="No tier revenue recorded yet" />;

    const r = 15.91549430918954;
    let offset = 0;
    const segments = active.map(d => {
        const seg = { ...d, offset };
        offset += d.value;
        return seg;
    });

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-4">
            <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r={r} fill="transparent" stroke="#F5F4F1" strokeWidth="6" />
                    {segments.map((s, i) => (
                        <circle
                            key={i}
                            cx="18" cy="18" r={r}
                            fill="transparent"
                            stroke={s.color}
                            strokeWidth="6"
                            strokeDasharray={`${s.value} ${100 - s.value}`}
                            strokeDashoffset={-s.offset}
                            strokeLinecap={active.length === 1 ? 'butt' : 'round'}
                        />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-[#101F38]">{active[0].value}%</span>
                    {active.length === 1 && (
                        <span className="text-[10px] font-bold text-[#8A8F98] uppercase tracking-wider text-center px-2">{active[0].name}</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {active.map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }}></span>
                        <span className="text-sm font-bold text-[#101F38] w-32">{t.name}</span>
                        <span className="text-sm font-semibold text-[#5B6472]">{t.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------- Conversion Funnel: stage bars scaled to the top of funnel, plus a rate summary ---------- */
function ConversionFunnel({ stats }: { stats?: RevenueData['funnel_stats'] }) {
    const data = [
        { step: 'Applications Created', count: stats?.applications_created || 0, color: '#101F38' },
        { step: 'Payments Completed', count: stats?.payments_completed || 0, color: '#2F8A5F' },
        { step: 'Pending Payments', count: stats?.pending_payments || 0, color: '#B98A0A' },
    ];
    const max = Math.max(...data.map(d => d.count), 1);
    return (
        <div className="flex flex-col gap-4 py-2 max-w-2xl mx-auto">
            {data.map((f, i) => {
                const widthPct = f.count === 0 ? 0 : Math.max((f.count / max) * 100, 8);
                return (
                    <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-[#5B6472]">{f.step}</span>
                            <span className="text-xs font-black" style={{ color: f.count === 0 ? '#B7B4AA' : f.color }}>{f.count.toLocaleString()}</span>
                        </div>
                        <div className="h-8 bg-[#F5F4F1] rounded-lg overflow-hidden">
                            <div className="h-full rounded-lg transition-all" style={{ width: `${widthPct}%`, backgroundColor: f.color }} />
                        </div>
                    </div>
                );
            })}
            <div className="mt-2 rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#FBEFE8' }}>
                <span className="text-sm font-bold text-[#C93500]">Conversion Rate</span>
                <span className="text-lg font-black text-[#C93500]">{stats?.conversion_rate || 0}%</span>
            </div>
        </div>
    );
}

function ChartEmptyState({ message }: { message: string }) {
    return <div className="flex items-center justify-center h-[220px] text-sm font-semibold text-[#B7B4AA]">{message}</div>;
}

const StatCard = ({ label, value, sublabel, icon, iconBg, iconColor }: { label: string; value: string; sublabel: string; icon: (p: any) => React.ReactElement; iconBg: string; iconColor: string; }) => {
    const gradientClass = {
        '#DDF3E4': 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        '#EAF0FB': 'from-blue-500/10 via-blue-500/5 to-transparent',
        '#EFE9FB': 'from-purple-500/10 via-purple-500/5 to-transparent',
        '#FBEFE3': 'from-orange-500/10 via-orange-500/5 to-transparent',
    }[iconBg] || 'from-slate-500/10 to-transparent';

    const blurBg = {
        '#DDF3E4': 'from-emerald-500/20',
        '#EAF0FB': 'from-blue-500/20',
        '#EFE9FB': 'from-purple-500/20',
        '#FBEFE3': 'from-orange-500/20',
    }[iconBg] || 'from-slate-500/20';

    return (
        <div className={`rounded-lg relative overflow-hidden border-0 bg-gradient-to-br ${gradientClass} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in`}>
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${blurBg} to-transparent rounded-full blur-3xl opacity-60`}></div>
            <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl ${blurBg} to-transparent rounded-full blur-2xl opacity-40`}></div>
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <h3 className="tracking-tight text-sm font-semibold text-slate-600">{label}</h3>
                <div className="p-2.5 rounded-xl shadow-lg" style={{ backgroundColor: iconBg }}>
                    <span style={{ color: iconColor }}>
                        {icon({ width: 20, height: 20 })}
                    </span>
                </div>
            </div>
            <div className="p-6 pt-0 relative z-10">
                <div className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">{value}</div>
                <p className="text-xs text-slate-600 mt-2 font-medium">{sublabel}</p>
            </div>
        </div>
    );
};

const TAB_COPY: Record<Tab, { title: string; subtitle: string }> = {
    'Revenue Trends': { title: 'Monthly Revenue', subtitle: 'Revenue trends over time' },
    'By Service': { title: 'Revenue by Service', subtitle: 'Breakdown by service type' },
    'By Tier': { title: 'Revenue by Tier', subtitle: 'Distribution across pricing tiers' },
    'Conversion Funnel': { title: 'Payment Conversion Funnel', subtitle: 'From application creation to payment' },
};

export default function RevenueDashboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Revenue Trends');
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const revData = await getRevenueData();
            setRevenueData(revData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="mb-6 px-1 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Revenue Dashboard</h1>
                    <p className="text-sm text-slate-600 mt-1">Comprehensive revenue analytics and payment insights</p>
                </div>
                <button onClick={loadData} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 shrink-0">
                    <Icon.refresh width={16} height={16} />
                    Refresh
                </button>
            </div>

            <div className="space-y-6">
                {/* Tabs */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div style={{ animationDelay: '0ms' }}>
                        <StatCard label="Total Revenue" value={revenueData ? money(revenueData.stats.total_revenue) : "$0.00"} sublabel="All time" icon={Icon.dollar} iconBg="#DDF3E4" iconColor="#2F8A5F" />
                    </div>
                    <div style={{ animationDelay: '100ms' }}>
                        <StatCard label="Avg Transaction" value={revenueData ? money(revenueData.stats.total_revenue / Math.max(revenueData.funnel_stats?.payments_completed || 1, 1)) : "$0.00"} sublabel="Per payment" icon={Icon.trend} iconBg="#EAF0FB" iconColor="#3A6FC4" />
                    </div>
                    <div style={{ animationDelay: '200ms' }}>
                        <StatCard label="Total Transactions" value={revenueData ? String(revenueData.funnel_stats?.payments_completed || 0) : "0"} sublabel="Completed payments" icon={Icon.hash} iconBg="#EFE9FB" iconColor="#7C5CBF" />
                    </div>
                    <div style={{ animationDelay: '300ms' }}>
                        <StatCard label="Conversion Rate" value={`${revenueData?.funnel_stats?.conversion_rate || 0}%`} sublabel="Applications to paid" icon={Icon.percent} iconBg="#FBEFE3" iconColor="#C97A2B" />
                    </div>
                </div>

                {/* Tabs */}
                <div dir="ltr" data-orientation="horizontal" className="space-y-4">
                    <div role="tablist" aria-orientation="horizontal" className="h-10 items-center justify-center text-slate-500 grid w-full grid-cols-4 bg-slate-100/30 p-1 rounded-xl" tabIndex={0}>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg ${activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600'}`}
                                tabIndex={-1}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Chart card */}
                    <div className="rounded-lg border-0 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="tracking-tight text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{TAB_COPY[activeTab].title}</h3>
                            <p className="text-slate-600 text-sm">{TAB_COPY[activeTab].subtitle}</p>
                        </div>
                        <div className="p-6 pt-6">
                            {activeTab === 'Revenue Trends' && (
                                <>
                                    <RevenueChart data={revenueData?.monthly_revenue || []} />
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                        <span className="text-xs font-bold text-slate-600">Revenue ($)</span>
                                    </div>
                                </>
                            )}

                            {activeTab === 'By Service' && <ServiceBreakdown byService={revenueData?.by_service || []} />}
                            {activeTab === 'By Tier' && <TierDonut byTier={revenueData?.by_tier || []} />}
                            {activeTab === 'Conversion Funnel' && <ConversionFunnel stats={revenueData?.funnel_stats} />}
                        </div>
                    </div>
                </div>

                {/* Performance Leaderboard */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">Performance Leaderboard</h3>
                        <p className="text-sm text-muted-foreground">Top performers by completed cases</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {(revenueData?.leaderboard || []).map((person) => (
                                <div key={person.rank} className="flex items-center gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        {person.rank}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{person.name}</p>
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                                {person.role}
                                            </div>
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                                    <path d="m9 11 3 3L22 4"></path>
                                                </svg>
                                                {person.completed} completed
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                                    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
                                                </svg>
                                                {person.active} active
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                {person.avg}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <div aria-valuemax={100} aria-valuemin={0} role="progressbar" data-state="indeterminate" data-max="100" className="relative h-4 w-full flex-1 overflow-hidden rounded-full bg-secondary">
                                                <div data-state="indeterminate" data-max="100" className="h-full w-full flex-1 transition-all bg-gradient-to-r from-orange-500 to-orange-600" style={{ transform: `translateX(-${100 - Math.min(person.percent, 100)}%)` }} />
                                            </div>
                                            <span className="w-12 text-right text-xs text-muted-foreground">{person.percent}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}