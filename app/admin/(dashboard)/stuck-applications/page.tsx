"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCases, Application } from '@/lib/api/cases';

const Icon = {
    alert: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
        </svg>
    ),
    clock: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    file: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
        </svg>
    ),
    arrow: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
        </svg>
    ),
    user: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    ),
    calendar: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
        </svg>
    ),
};

type CaseItem = {
    id: number;
    caseName: string;
    caseType: 'Critical' | 'Paid' | 'Free';
    email: string;
    daysStuck: number;
    created: string;
    progressPct: number;
    status: string;
};

type Group = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    items: CaseItem[];
};

const MOCK_GROUPS: Array<{ title: string; subtitle: string; icon: React.ReactNode; groupId: string }> = [
    {
        title: 'Payment Pending',
        subtitle: "Users who created applications but haven't completed payment",
        icon: <Icon.alert width={20} height={20} />,
        groupId: 'payment-pending',
    },
    {
        title: 'Abandoned Mid-Process',
        subtitle: 'Started but stopped partway through',
        icon: <Icon.clock width={20} height={20} />,
        groupId: 'abandoned',
    },
    {
        title: 'Not Started',
        subtitle: 'Application created but intake not begun',
        icon: <Icon.file width={20} height={20} />,
        groupId: 'not-started',
    },
    {
        title: 'Almost Complete',
        subtitle: 'Near completion but stalled',
        icon: <Icon.arrow width={20} height={20} />,
        groupId: 'almost-complete',
    },
    {
        title: 'Long Inactive',
        subtitle: 'No activity for over a week',
        icon: <Icon.clock width={20} height={20} />,
        groupId: 'long-inactive',
    },
];

function StatusPill({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Pending: 'bg-orange-50 text-orange-500 border border-orange-200',
        Paid: 'bg-emerald-50 text-emerald-500 border border-emerald-200',
        Free: 'bg-slate-50 text-slate-500 border border-slate-200',
        Active: 'bg-blue-50 text-blue-500 border border-blue-200',
        Approved: 'bg-emerald-50 text-emerald-500 border border-emerald-200',
        Rejected: 'bg-red-50 text-red-500 border border-red-200',
        Cancelled: 'bg-slate-50 text-slate-500 border border-slate-200',
        'Application received': 'bg-blue-50 text-blue-500 border border-blue-200',
        'Biometrics scheduled': 'bg-indigo-50 text-indigo-500 border border-indigo-200',
        'Evidence review': 'bg-yellow-50 text-yellow-600 border border-yellow-200',
        'Decision pending': 'bg-orange-50 text-orange-500 border border-orange-200',
        'Under Review': 'bg-purple-50 text-purple-500 border border-purple-200',
        'Action Required': 'bg-red-50 text-red-600 border border-red-200',
    };
    
    const styleClass = styles[status] || 'bg-slate-50 text-slate-600 border border-slate-200';
    
    return (
        <div className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide ${styleClass}`}>
            {status}
        </div>
    );
}

function CaseRow({ item }: { item: CaseItem }) {
    return (
        <div className="group relative overflow-hidden rounded-xl p-4 border border-slate-200 bg-slate-50 hover:border-orange-400 hover:bg-[#FFF9F5] transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-semibold text-base text-slate-800 group-hover:text-orange-500 transition-colors">{item.caseName}</h4>
                        <div className="inline-flex items-center rounded-full font-semibold text-[10px] px-2 py-0.5 bg-[#FF4B4B] text-white">
                            {item.caseType}
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-4">
                        <span className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                            <div className="p-1 rounded-md bg-[#FFF0E6]">
                                <Icon.user width={14} height={14} className="text-[#FF9B70]" />
                            </div>
                            <span>{item.email}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                            <div className="p-1 rounded-md bg-[#FFF0E6]">
                                <Icon.clock width={14} height={14} className="text-[#FF9B70]" />
                            </div>
                            <span>{item.daysStuck} days stuck</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
                            <div className="p-1 rounded-md bg-[#EAF4FF]">
                                <Icon.calendar width={14} height={14} className="text-[#7CB5EC]" />
                            </div>
                            <span>Created {item.created}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden relative">
                            <div className="h-full bg-gradient-to-b from-orange-500 to-orange-600 transition-all duration-500" style={{ width: `${item.progressPct}%` }}></div>
                        </div>
                        <span className="text-sm font-semibold text-orange-500 min-w-[35px]">{item.progressPct}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                    <StatusPill status={item.status} />
                    <Link href={`/manager/assigned-cases/${item.id}`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white h-8 rounded-lg px-4 hover:bg-slate-50 text-slate-700 transition-colors">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}

function GroupSection({ group, groupIcon }: { group: Group; groupIcon: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-slate-50/0">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-[#FFF4E5] p-2 text-[#FFB020]">
                        {groupIcon}
                    </div>
                    <div>
                        <h3 className="text-[22px] font-bold leading-none tracking-tight text-[#2B3674]">{group.title}</h3>
                        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">{group.subtitle}</p>
                    </div>
                </div>
                <div className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 bg-white">
                    {group.items.length} affected
                </div>
            </div>
            <div className="p-5 pt-0">
                <div className="space-y-4">
                    {group.items.map((item, i) => (
                        <CaseRow key={`${item.caseName}-${i}`} item={item} />
                    ))}
                </div>
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

    // Convert cases to CaseItem shape
    const toCaseItem = (c: Application, index: number): CaseItem => {
        const created = new Date(c.created_at);
        const daysStuck = Math.max(0, Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24)));
        let progressPct = 0;
        if (typeof (c as any).progress === 'number') progressPct = (c as any).progress;
        else if (typeof (c as any).progress === 'string') progressPct = parseInt(((c as any).progress || '0').replace('%', '')) || 0;

        return {
            id: c.id,
            caseName: c.title || `App #${c.id}`,
            caseType: 'Critical',
            email: c.user?.email || 'unknown@example.com',
            daysStuck,
            created: created.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
            progressPct,
            status: c.status || 'Pending',
        };
    };

    const allItems = cases.map(toCaseItem);

    // Mock data for demonstration
    const mockItems: CaseItem[] = [
        {
            id: 1,
            caseName: 'I-485 Adjustment of Status',
            caseType: 'Critical',
            email: 'john.doe@email.com',
            daysStuck: 8,
            created: '10/15/2024',
            progressPct: 15,
            status: 'Pending',
        },
        {
            id: 2,
            caseName: 'I-130 Petition for Spouse',
            caseType: 'Critical',
            email: 'jane.smith@email.com',
            daysStuck: 11,
            created: '10/10/2024',
            progressPct: 45,
            status: 'Paid',
        },
        {
            id: 3,
            caseName: 'N-400 Naturalization',
            caseType: 'Critical',
            email: 'mike.johnson@email.com',
            daysStuck: 14,
            created: '10/5/2024',
            progressPct: 25,
            status: 'Paid',
        },
        {
            id: 4,
            caseName: 'I-751 Remove Conditions',
            caseType: 'Critical',
            email: 'sarah.williams@email.com',
            daysStuck: 8,
            created: '10/8/2024',
            progressPct: 85,
            status: 'Paid',
        },
        {
            id: 5,
            caseName: 'DACA Renewal',
            caseType: 'Critical',
            email: 'alex.brown@email.com',
            daysStuck: 21,
            created: '9/28/2024',
            progressPct: 30,
            status: 'Paid',
        },
    ];

    const displayItems = allItems.length > 0 ? allItems : mockItems;

    // Stat cards data
    const statCards = [
        {
            label: 'Total Stuck',
            value: '5',
            sub: 'Applications need attention',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            iconBgColor: 'bg-orange-100',
            iconColor: 'text-orange-600',
            valueColor: 'text-orange-600',
        },
        {
            label: 'Critical',
            value: '2',
            sub: 'Inactive for 7+ days',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            iconBgColor: 'bg-red-100',
            iconColor: 'text-red-600',
            valueColor: 'text-red-600',
        },
        {
            label: 'Recovery Rate',
            value: '--',
            sub: 'Coming soon',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            iconBgColor: 'bg-green-100',
            iconColor: 'text-green-600',
            valueColor: 'text-green-600',
        },
    ];

    // Build groups with mock data
    const groups: Array<Group> = [
        {
            title: 'Payment Pending',
            subtitle: "Users who created applications but haven't completed payment",
            icon: <Icon.alert width={20} height={20} />,
            items: displayItems.slice(0, 1),
        },
        {
            title: 'Abandoned Mid-Process',
            subtitle: 'Started but stopped partway through',
            icon: <Icon.clock width={20} height={20} />,
            items: displayItems.slice(1, 2),
        },
        {
            title: 'Not Started',
            subtitle: 'Application created but intake not begun',
            icon: <Icon.file width={20} height={20} />,
            items: displayItems.slice(2, 3),
        },
        {
            title: 'Almost Complete',
            subtitle: 'Near completion but stalled',
            icon: <Icon.arrow width={20} height={20} />,
            items: displayItems.slice(3, 4),
        },
        {
            title: 'Long Inactive',
            subtitle: 'No activity for over a week',
            icon: <Icon.clock width={20} height={20} />,
            items: displayItems.slice(4, 5),
        },
    ];

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="mb-6 px-1">
                <h1 className="text-2xl font-bold text-slate-900">Stuck Applications</h1>
                <p className="text-sm text-slate-600 mt-1">Monitor and manage applications that need attention</p>
            </div>

            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    {statCards.map((stat, idx) => (
                        <div key={stat.label} className={`rounded-lg border-2 ${stat.borderColor} ${stat.bgColor} relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in hover:scale-[1.02]`} style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                                <h3 className="tracking-tight text-sm font-semibold text-slate-700">{stat.label}</h3>
                                <div className={`p-2 rounded-lg ${stat.iconBgColor}`}>
                                    {stat.label === 'Total Stuck' && <Icon.alert width={16} height={16} className={stat.iconColor} />}
                                    {stat.label === 'Critical' && <Icon.alert width={16} height={16} className={stat.iconColor} />}
                                    {stat.label === 'Recovery Rate' && <Icon.arrow width={16} height={16} className={stat.iconColor} />}
                                </div>
                            </div>
                            <div className="p-6 pt-0 relative z-10">
                                <div className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</div>
                                <p className="text-xs text-slate-600 mt-1">{stat.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Group Sections */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-sm text-slate-600">Loading stuck applications...</div>
                    ) : (
                        groups.map((group, idx) => (
                            <GroupSection key={group.title} group={group} groupIcon={MOCK_GROUPS[idx]?.icon} />
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}