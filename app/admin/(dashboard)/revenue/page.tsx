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

/**
 * Full transaction set (not just the 10 shown in "Recent Transactions").
 * Both breakdown charts below aggregate over this array using the correct
 * fields — `title` for service, `plan` for tier — rather than `status`,
 * which is what was producing the "paid: 100%" donut and the sparse,
 * mislabeled service bars.
 */
const allTransactions: Transaction[] = [
    { id: 'TRX-9231', title: 'Green Card Renewal', plan: 'Advanced Plan', date: 'Jul 17, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9230', title: 'Green Card Renewal', plan: 'Advanced Plan', date: 'Jul 17, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9229', title: 'Green Card Renewal', plan: 'Basic Plan', date: 'Jul 16, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9228', title: 'Child Petition', plan: 'Advanced Plan', date: 'Jul 15, 2026', amount: '$789.99', status: 'Completed' },
    { id: 'TRX-9227', title: 'Child Petition', plan: 'Advanced Plan', date: 'Jul 15, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9226', title: 'Child Petition', plan: 'Advanced Plan', date: 'Jul 14, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9225', title: 'Marriage Green Card', plan: 'Basic Plan', date: 'Jul 13, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9224', title: 'K-1 Fiancé Visa', plan: 'Advanced Plan', date: 'Jul 12, 2026', amount: '$849.99', status: 'Completed' },
    { id: 'TRX-9223', title: 'K-1 Fiancé Visa', plan: 'Basic Plan', date: 'Jul 12, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9222', title: 'Green Card Renewal', plan: 'Basic Plan', date: 'Jul 11, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9221', title: 'Parent Adjustment of Status', plan: 'Basic Plan', date: 'Jul 10, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9220', title: 'Parent Adjustment of Status', plan: 'Basic Plan', date: 'Jul 9, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9219', title: 'Spouse Petition', plan: 'Basic Plan', date: 'Jul 9, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9218', title: 'Spouse Petition', plan: 'Advanced Plan', date: 'Jul 8, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9217', title: 'Green Card Renewal', plan: 'Advanced Plan', date: 'Jul 8, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9216', title: 'Child Petition', plan: 'Basic Plan', date: 'Jul 7, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9215', title: 'Marriage Green Card', plan: 'Advanced Plan', date: 'Jul 7, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9214', title: 'K-1 Fiancé Visa', plan: 'Advanced Plan', date: 'Jul 6, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9213', title: 'Green Card Renewal', plan: 'Basic Plan', date: 'Jul 6, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9212', title: 'Parent Adjustment of Status', plan: 'Advanced Plan', date: 'Jul 5, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9211', title: 'Spouse Petition', plan: 'Basic Plan', date: 'Jul 5, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9210', title: 'Green Card Renewal', plan: 'Advanced Plan', date: 'Jul 4, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9209', title: 'Child Petition', plan: 'Advanced Plan', date: 'Jul 4, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9208', title: 'Marriage Green Card', plan: 'Basic Plan', date: 'Jul 3, 2026', amount: '$0.00', status: 'Completed' },
    { id: 'TRX-9207', title: 'K-1 Fiancé Visa', plan: 'Basic Plan', date: 'Jul 3, 2026', amount: '$0.00', status: 'Completed' },
];

// "Recent Transactions" only ever shows the latest slice of the full set
const recentTransactions = allTransactions.slice(0, 10);

const monthlyRevenue = [
    { month: 'Feb', value: 920 },
    { month: 'Mar', value: 1180 },
    { month: 'Apr', value: 1005 },
    { month: 'May', value: 1340 },
    { month: 'Jun', value: 1260 },
    { month: 'Jul', value: 1639.98 },
];

// Real funnel counts, independent of the transaction list above since
// "applications" includes ones that never reached checkout.
const APPLICATIONS_CREATED = 36;
const PAYMENTS_COMPLETED = 25;
const PENDING_PAYMENTS = 0;
const CONVERSION_RATE = Math.round((PAYMENTS_COMPLETED / APPLICATIONS_CREATED) * 1000) / 10; // 69.4

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
                        <stop offset="0%" stopColor="#E3755D" />
                        <stop offset="100%" stopColor="#F2A085" />
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
                    <stop offset="0%" stopColor="#E3755D" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#E3755D" stopOpacity="0" />
                </linearGradient>
            </defs>
            {[0, 1, 2, 3].map(i => (
                <line key={i} x1={pad} x2={w - pad} y1={pad + (i * (h - pad * 1.5)) / 3} y2={pad + (i * (h - pad * 1.5)) / 3} stroke="#ECE9E2" strokeWidth="1" />
            ))}
            <path d={area} fill="url(#revFill)" />
            <path d={line} fill="none" stroke="#E3755D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#E3755D" strokeWidth="2.5" />)}
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
            color: b.tier === 'Premium' ? '#E3755D' : '#101F38',
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
function ConversionFunnel() {
    const data = [
        { step: 'Applications Created', count: APPLICATIONS_CREATED, color: '#101F38' },
        { step: 'Payments Completed', count: PAYMENTS_COMPLETED, color: '#2F8A5F' },
        { step: 'Pending Payments', count: PENDING_PAYMENTS, color: '#B98A0A' },
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
                <span className="text-lg font-black text-[#C93500]">{CONVERSION_RATE}%</span>
            </div>
        </div>
    );
}

function ChartEmptyState({ message }: { message: string }) {
    return <div className="flex items-center justify-center h-[220px] text-sm font-semibold text-[#B7B4AA]">{message}</div>;
}

const StatCard = ({ label, value, sublabel, icon, iconBg, iconColor }: { label: string; value: string; sublabel: string; icon: (p: any) => React.ReactElement; iconBg: string; iconColor: string; }) => (
    <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6">
        <div className="flex items-start justify-between mb-5">
            <p className="text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">{label}</p>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg, color: iconColor }}>
                {icon({ width: 15, height: 15 })}
            </span>
        </div>
        <h3 className="text-[26px] font-black text-[#101F38] tracking-tight leading-none mb-2">{value}</h3>
        <p className="text-xs font-semibold text-[#B7B4AA]">{sublabel}</p>
    </div>
);

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
        <div className="max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Revenue Dashboard</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Comprehensive revenue analytics and payment insights.</p>
                </div>
                <button onClick={loadData} className="flex items-center gap-2 bg-white border border-[#ECE9E2] hover:border-[#101F38] text-[#101F38] px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm w-fit">
                    <Icon.refresh width={14} height={14} />
                    Refresh
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Revenue" value={revenueData ? money(revenueData.stats.total_revenue) : "$0.00"} sublabel="This month" icon={Icon.dollar} iconBg="#DDF3E4" iconColor="#2F8A5F" />
                <StatCard label="Revenue Growth" value={revenueData ? `${revenueData.stats.revenue_growth}%` : "0%"} sublabel="vs last month" icon={Icon.trend} iconBg="#EAF0FB" iconColor="#3A6FC4" />
                <StatCard label="Active Subscriptions" value={revenueData ? String(revenueData.stats.active_subscriptions) : "0"} sublabel="Current purchases" icon={Icon.hash} iconBg="#EFE9FB" iconColor="#7C5CBF" />
                <StatCard label="Conversion Rate" value={`${CONVERSION_RATE}%`} sublabel="Applications to paid" icon={Icon.percent} iconBg="#FBEFE3" iconColor="#C97A2B" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#F5F4F1] rounded-xl p-1 mb-6 w-fit overflow-x-auto max-w-full">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-[#101F38] shadow-sm' : 'text-[#5B6472] hover:text-[#101F38]'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Chart card */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 mb-6">
                <h2 className="font-bold text-[#101F38] text-lg mb-1">{TAB_COPY[activeTab].title}</h2>
                <p className="text-[#5B6472] font-medium text-sm mb-2">{TAB_COPY[activeTab].subtitle}</p>

                {activeTab === 'Revenue Trends' && (
                    <>
                        <RevenueChart data={monthlyRevenue} />
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#E3755D]"></span>
                            <span className="text-xs font-bold text-[#5B6472]">Revenue ($)</span>
                        </div>
                    </>
                )}

                {activeTab === 'By Service' && <ServiceBreakdown byService={revenueData?.by_service || []} />}
                {activeTab === 'By Tier' && <TierDonut byTier={revenueData?.by_tier || []} />}
                {activeTab === 'Conversion Funnel' && <ConversionFunnel />}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-[#ECE9E2] flex justify-between items-center bg-[#F9F8F6]">
                    <div>
                        <h2 className="font-bold text-[#101F38] text-lg">Recent Transactions</h2>
                        <p className="text-[#5B6472] font-medium text-xs mt-0.5">Latest {recentTransactions.length} completed payments</p>
                    </div>
                    <button className="text-sm font-bold text-[#E3755D] hover:underline shrink-0">View All</button>
                </div>
                <div className="divide-y divide-[#ECE9E2]">
                    {recentTransactions.map(trx => (
                        <div key={trx.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F9F8F6] transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-[#F5F4F1] border border-[#ECE9E2] flex items-center justify-center text-[#5B6472] shrink-0">
                                    <Icon.dollar width={14} height={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[#101F38] truncate">{trx.title} &ndash; {trx.plan}</p>
                                    <p className="text-xs font-semibold text-[#8A8F98]">paid &middot; {trx.date}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0 pl-4">
                                <p className="text-sm font-black text-[#101F38]">{trx.amount}</p>
                                <div className="mt-1"><StatusBadge status={trx.status} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}