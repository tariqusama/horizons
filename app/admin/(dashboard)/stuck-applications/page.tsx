"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCases, Application } from '@/lib/api/cases';

const TOP_STATS = [
    {
        label: 'Total stuck',
        value: '5',
        sub: 'Applications need attention',
        bg: '#FBF1EA',
        labelColor: '#101F38',
        valueColor: '#E3755D',
        iconBg: '#FAEEDA',
        iconColor: '#BA7517',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    {
        label: 'Critical',
        value: '2',
        sub: 'Inactive for 7+ days',
        bg: '#FCEBEB',
        labelColor: '#101F38',
        valueColor: '#E24B4A',
        iconBg: '#F7C1C1',
        iconColor: '#A32D2D',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    {
        label: 'Recovery rate',
        value: '--',
        sub: 'Coming soon',
        bg: '#EAF3DE',
        labelColor: '#101F38',
        valueColor: '#3B6D11',
        iconBg: '#C0DD97',
        iconColor: '#27500A',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        ),
    },
];

type CaseItem = {
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

const GROUPS: Group[] = [
    {
        title: 'Payment pending',
        subtitle: "Users who created applications but haven't completed payment",
        iconColor: '#BA7517',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        items: [
            {
                caseName: 'I-485 Adjustment of Status',
                caseType: 'Critical',
                email: 'john.doe@email.com',
                daysStuck: 8,
                created: '10/15/2024',
                progressPct: 15,
                status: 'Pending',
            },
        ],
    },
    {
        title: 'Abandoned mid-process',
        subtitle: 'Started but stopped partway through',
        iconColor: '#185FA5',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        items: [
            {
                caseName: 'I-130 Petition for Spouse',
                caseType: 'Critical',
                email: 'jane.smith@email.com',
                daysStuck: 11,
                created: '10/10/2024',
                progressPct: 45,
                status: 'Paid',
            },
        ],
    },
    {
        title: 'Not started',
        subtitle: 'Application created but intake not begun',
        iconColor: '#5F5E5A',
        highlight: true,
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
            </svg>
        ),
        items: [
            {
                caseName: 'N-400 Naturalization',
                caseType: 'Critical',
                email: 'mike.johnson@email.com',
                daysStuck: 14,
                created: '10/5/2024',
                progressPct: 25,
                status: 'Paid',
            },
        ],
    },
    {
        title: 'Almost complete',
        subtitle: 'Near completion but stalled',
        iconColor: '#3B6D11',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        ),
        items: [
            {
                caseName: 'I-751 Remove Conditions',
                caseType: 'Critical',
                email: 'sarah.williams@email.com',
                daysStuck: 6,
                created: '10/8/2024',
                progressPct: 85,
                status: 'Paid',
            },
        ],
    },
    {
        title: 'Long inactive',
        subtitle: 'No activity for over a week',
        iconColor: '#A32D2D',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        items: [
            {
                caseName: 'DACA Renewal',
                caseType: 'Critical',
                email: 'alex.brown@email.com',
                daysStuck: 21,
                created: '9/28/2024',
                progressPct: 30,
                status: 'Paid',
            },
        ],
    },
];

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
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16v16H4z" opacity="0" />
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-10 6L2 7" />
                            </svg>
                            {item.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                            </svg>
                            {item.daysStuck} days stuck
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Created {item.created}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={item.status} />
                    <button className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3.5 py-2 hover:bg-[#F7F5F0] transition-colors">
                        View
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <div className="h-1.5 flex-1 rounded-full bg-[#ECE9E2] overflow-hidden">
                    <div
                        className="h-full rounded-full bg-[#E3755D]"
                        style={{ width: `${item.progressPct}%` }}
                    />
                </div>
                <span className="text-[11px] font-semibold text-[#E3755D] w-8 text-right">{item.progressPct}%</span>
            </div>
        </div>
    );
}

function GroupSection({ group }: { group: Group }) {
    return (
        <div
            className={`rounded-3xl border bg-white p-6 shadow-sm ${group.highlight ? 'border-[#E3755D]' : 'border-[#ECE9E2]'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span style={{ color: group.iconColor }}>{group.icon}</span>
                    <div>
                        <h3 className="text-sm font-bold text-[#101F38]">{group.title}</h3>
                        <p className="text-xs text-[#5B6472] font-medium">{group.subtitle}</p>
                    </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F7F5F0] text-[#5B6472] shrink-0">
                    {group.items.length} affected
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {group.items.map((item, i) => (
                    <CaseRow key={`${item.caseName}-${i}`} item={item} />
                ))}
            </div>
        </div>
    );
}

export default function AdminStuckApplicationsPage() {
    const [cases, setCases] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCases();
                setCases(data);
            } catch (err) {
                console.error('Failed to load cases for stuck applications', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // convert cases to CaseItem shape
    const toCaseItem = (c: Application): CaseItem => {
        const created = new Date(c.created_at);
        const daysStuck = Math.max(0, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
        // derive progressPct from c.progress if present (e.g. '45%') else fallback
        let progressPct = 0;
        if (typeof (c as any).progress === 'number') progressPct = (c as any).progress;
        else if (typeof (c as any).progress === 'string') progressPct = parseInt(((c as any).progress || '0').replace('%', '')) || 0;

        return {
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

    const buildGroups = (): Group[] => {
        const paymentPending = allItems.filter(i => i.status === 'Pending' && i.progressPct < 50);
        const abandoned = allItems.filter(i => i.progressPct >= 10 && i.progressPct < 50 && i.daysStuck > 7);
        const notStarted = allItems.filter(i => i.progressPct <= 10 && i.daysStuck > 3);
        const almostComplete = allItems.filter(i => i.progressPct >= 75 && i.daysStuck > 3);
        const longInactive = allItems.filter(i => i.daysStuck > 14);

        return [
            { title: 'Payment pending', subtitle: "Users who created applications but haven't completed payment", iconColor: '#BA7517', icon: GROUPS[0].icon, items: paymentPending },
            { title: 'Abandoned mid-process', subtitle: 'Started but stopped partway through', iconColor: '#185FA5', icon: GROUPS[1].icon, items: abandoned },
            { title: 'Not started', subtitle: 'Application created but intake not begun', iconColor: '#5F5E5A', highlight: true, icon: GROUPS[2].icon, items: notStarted },
            { title: 'Almost complete', subtitle: 'Near completion but stalled', iconColor: '#3B6D11', icon: GROUPS[3].icon, items: almostComplete },
            { title: 'Long inactive', subtitle: 'No activity for over two weeks', iconColor: '#A32D2D', icon: GROUPS[4].icon, items: longInactive },
        ];
    };

    const groupsToRender = buildGroups();

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Stuck applications</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Monitor and manage applications that need attention</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {TOP_STATS.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-3xl p-6"
                        style={{ backgroundColor: stat.bg }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-sm font-semibold" style={{ color: stat.labelColor }}>
                                {stat.label}
                            </span>
                            <span
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
                            >
                                {stat.icon}
                            </span>
                        </div>
                        <p className="text-3xl font-black mb-1 tracking-tight" style={{ color: stat.valueColor }}>
                            {stat.label === 'Total stuck' ? allItems.length : stat.value}
                        </p>
                        <p className="text-xs text-[#5B6472] font-medium">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="text-sm text-[#5B6472]">Loading stuck applications...</div>
                ) : (
                    groupsToRender.map((group) => (
                        <GroupSection key={group.title} group={group} />
                    ))
                )}
            </div>
        </div>
    );
}