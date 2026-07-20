'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { getTickets, Ticket as ApiTicket } from '../../../../lib/api/tickets';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    filter: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
    more: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>,
    chevron: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    message: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    alertCircle: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    clock: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    checkCircle: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
};

type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
type Priority = 'High' | 'Medium' | 'Low';

// API data

const STATUS_TABS: Array<Status | 'All'> = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

const StatusBadge = ({ status }: { status: Status }) => {
    const styles: Record<Status, string> = {
        Open: 'bg-[#FBE1E6] text-[#D6497A]',
        'In Progress': 'bg-[#FBEFD1] text-[#B98A0A]',
        Resolved: 'bg-[#DDF3E4] text-[#2F8A5F]',
        Closed: 'bg-[#EDEBE5] text-[#5B6472]',
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

const PriorityIndicator = ({ priority }: { priority: Priority }) => {
    const dot: Record<Priority, string> = {
        High: 'bg-[#D64545]',
        Medium: 'bg-[#E3755D]',
        Low: 'bg-[#5B6472]',
    };
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${dot[priority]}`}></div>
            <span className="text-sm font-semibold text-[#101F38]">{priority}</span>
        </div>
    );
};

const StatCard = ({
    label,
    value,
    icon,
    tint,
    iconColor,
}: {
    label: string;
    value: number;
    icon: (p: any) => React.ReactNode;
    tint: string;
    iconColor: string;
}) => (
    <div className={`rounded-2xl p-5 border border-[#ECE9E2] ${tint}`}>
        <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-semibold text-[#5B6472]">{label}</span>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
                {icon({ width: 15, height: 15 })}
            </span>
        </div>
        <div className="text-[26px] font-black text-[#101F38] leading-none">{value}</div>
    </div>
);

export default function TicketsPage() {
    const [tickets, setTickets] = useState<ApiTicket[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All Statuses'>('All Statuses');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'All Priorities'>('All Priorities');
    const [activeTab, setActiveTab] = useState<Status | 'All'>('All');
    const [page, setPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const data = await getTickets();
            setTickets(data);
        } catch (err) {
            console.error('Failed to load tickets', err);
        }
    };

    const counts = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length,
        closed: tickets.filter(t => t.status === 'Closed').length,
    }), []);

    const filtered = useMemo(() => {
        return tickets.filter(t => {
            if (activeTab !== 'All' && t.status !== activeTab) return false;
            if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false;
            if (priorityFilter !== 'All Priorities' && t.priority !== priorityFilter) return false;
            const q = search.trim().toLowerCase();
            if (q && !(t.ticket_id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.user?.name.toLowerCase().includes(q))) {
                return false;
            }
            return true;
        });
    }, [search, statusFilter, priorityFilter, activeTab, tickets]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageTickets = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount);
        }
    }, [pageCount, page]);

    const tabCount = (tab: Status | 'All') => tab === 'All' ? counts.total : tickets.filter(t => t.status === tab).length;

    return (
        <div className="max-w-[1400px] mx-auto w-full bg-[#F5F4F1] p-6 md:p-8 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Support Tickets</h1>
                <p className="text-[#5B6472] font-medium text-sm">Manage and resolve client inquiries, technical issues, and billing disputes.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Tickets" value={counts.total} icon={Icon.message} tint="bg-[#EAF0FB]" iconColor="bg-[#D7E4F7] text-[#3A6FC4]" />
                <StatCard label="Open" value={counts.open} icon={Icon.alertCircle} tint="bg-[#EAF0FB]" iconColor="bg-[#D7E4F7] text-[#3A6FC4]" />
                <StatCard label="In Progress" value={counts.inProgress} icon={Icon.clock} tint="bg-[#FBEFE3]" iconColor="bg-[#F6DCC0] text-[#C97A2B]" />
                <StatCard label="Resolved" value={counts.resolved} icon={Icon.checkCircle} tint="bg-[#E7F5EC]" iconColor="bg-[#CFEBDA] text-[#2F8A5F]" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm p-6 mb-6">
                <h2 className="text-sm font-black text-[#101F38] mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Search</label>
                        <div className="relative">
                            <Icon.search width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B7B4AA]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tickets by ID, subject, or client..."
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm text-[#101F38] placeholder-[#B7B4AA] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Status</label>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full appearance-none pl-4 pr-9 py-2 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            >
                                <option>All Statuses</option>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                            <Icon.chevron width={14} height={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7B4AA] pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#5B6472] mb-1.5">Priority</label>
                        <div className="relative">
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as any)}
                                className="w-full appearance-none pl-4 pr-9 py-2 rounded-xl border border-[#ECE9E2] bg-[#F5F4F1] text-sm font-semibold text-[#101F38] outline-none focus:border-[#E3755D] focus:bg-white transition-all"
                            >
                                <option>All Priorities</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                            <Icon.chevron width={14} height={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7B4AA] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets panel */}
            <div className="bg-white rounded-2xl border border-[#ECE9E2] shadow-sm flex flex-col">
                <div className="px-6 py-5 border-b border-[#ECE9E2]">
                    <h2 className="text-base font-black text-[#101F38] mb-1">All Tickets</h2>
                    <p className="text-[#5B6472] font-medium text-sm">Manage and respond to user support tickets</p>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4">
                    <div className="flex gap-1 bg-[#F5F4F1] rounded-xl p-1 overflow-x-auto">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'bg-white text-[#101F38] shadow-sm'
                                    : 'text-[#5B6472] hover:text-[#101F38]'
                                    }`}
                            >
                                {tab} ({tabCount(tab)})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table / Empty state */}
                <div className="flex-1 overflow-auto mt-4">
                    {pageTickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-12 h-12 rounded-full bg-[#F5F4F1] flex items-center justify-center text-[#B7B4AA] mb-4">
                                <Icon.message width={20} height={20} />
                            </div>
                            <p className="text-sm font-semibold text-[#5B6472]">No tickets found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-[#ECE9E2] bg-[#F9F8F6]">
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Ticket ID</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider">Date Created</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-[#5B6472] uppercase tracking-wider text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#ECE9E2]">
                                {pageTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-[#F9F8F6] transition-colors group cursor-pointer">
                                        <td className="px-6 py-4 text-sm font-bold text-[#8A8F98]">{ticket.ticket_id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-[#101F38]">{ticket.subject}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-[#5B6472]">{ticket.user?.name}</td>
                                        <td className="px-6 py-4"><StatusBadge status={ticket.status as Status} /></td>
                                        <td className="px-6 py-4"><PriorityIndicator priority={ticket.priority as Priority} /></td>
                                        <td className="px-6 py-4 text-sm font-semibold text-[#5B6472]">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#B7B4AA] hover:text-[#101F38] transition-colors p-1 opacity-0 group-hover:opacity-100">
                                                <Icon.more width={16} height={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#ECE9E2] flex items-center justify-between bg-[#F9F8F6] rounded-b-2xl">
                    <span className="text-xs font-semibold text-[#5B6472]">
                        Showing {pageTickets.length ? startIndex + 1 : 0} - {startIndex + pageTickets.length} of {filtered.length} tickets
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-lg border border-[#ECE9E2] bg-white text-sm font-bold ${page === 1 ? 'text-[#B7B4AA]' : 'text-[#101F38] hover:border-[#101F38]'}`}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className={`px-3 py-1 rounded-lg border border-[#ECE9E2] bg-white text-sm font-bold ${page === pageCount ? 'text-[#B7B4AA]' : 'text-[#101F38] hover:border-[#101F38]'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}