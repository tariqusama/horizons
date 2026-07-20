"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAssignmentRequests, updateAssignmentRequest, AssignmentRequest } from '@/lib/api/cases';
import { getUsers } from '../../../../lib/api/users';

const Icon = {
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    checkCircle: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    x: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    xCircle: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    clock: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    alert: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
};

// Fetched from API now

const STATUS_META: Record<string, string> = {
    Pending: "bg-[#FAEEDA] text-[#854F0B]",
    Approved: "bg-[#EAF3DE] text-[#3B6D11]",
    Denied: "bg-[#FCEBEB] text-[#A32D2D]",
};

const PRIORITY_META: Record<string, string> = {
    High: "bg-[#FCEBEB] text-[#A32D2D]",
    Medium: "bg-[#FAEEDA] text-[#854F0B]",
    Low: "bg-[#EEEDFE] text-[#534AB7]",
};

const FILTERS = ["All Requests", "Pending", "Approved", "Denied"];

export default function AssignmentRequestsPage() {
    const [filter, setFilter] = useState("All Requests");
    const [requests, setRequests] = useState<AssignmentRequest[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState<any[]>([]);
    const [managerFilter, setManagerFilter] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [modalRequest, setModalRequest] = useState<AssignmentRequest | null>(null);

    useEffect(() => {
        loadRequests(1);
    }, [filter, managerFilter, dateFrom, dateTo, perPage]);

    useEffect(() => {
        const loadManagers = async () => {
            try {
                const users = await getUsers();
                setManagers(users || []);
            } catch (err) {
                console.error('Failed to load managers', err);
            }
        };
        loadManagers();
    }, []);

    const loadRequests = async (p = page) => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page: p, per_page: perPage };
            if (filter !== 'All Requests') params.status = filter;
            if (managerFilter !== 'all') params.manager_id = managerFilter;
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;

            const resp = await getAssignmentRequests(params);
            setRequests(resp.data || []);
            setTotal(resp.total || 0);
            setLastPage(resp.last_page || 1);
            setPage(resp.current_page || 1);
        } catch (error) {
            console.error('Failed to load requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: number, action: 'Approved' | 'Denied') => {
        // optimistic UI: update local state first
        const prev = requests.map(r => ({ ...r }));
        setRequests(rs => rs.map(r => r.id === id ? { ...r, status: action } : r));
        try {
            await updateAssignmentRequest(id, action);
        } catch (error) {
            console.error('Failed to update request:', error);
            alert('Failed to update request');
            setRequests(prev);
        }
    };

    const filtered = requests; // server already filtered

    const counts = {
        pending: requests.filter(r => r.status === "Pending").length,
        approved: requests.filter(r => r.status === "Approved").length,
        denied: requests.filter(r => r.status === "Denied").length,
        total: requests.length,
    };

    return (
        <div className="max-w-[1400px] mx-auto w-full pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-[28px] font-black text-[#101F38] tracking-tight mb-2">Assignment Requests</h1>
                    <p className="text-[#5B6472] font-medium text-sm">Review and manage case assignment requests</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <p className="font-semibold text-[#101F38] text-sm">Pending</p>
                        <div className="w-8 h-8 rounded-full bg-[#FAEEDA] text-[#854F0B] flex items-center justify-center shrink-0">
                            <Icon.clock width={15} height={15} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#854F0B] tracking-tight mb-1">{counts.pending}</p>
                    <p className="text-xs font-medium text-[#5B6472]">Awaiting review</p>
                </div>

                <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <p className="font-semibold text-[#101F38] text-sm">Approved</p>
                        <div className="w-8 h-8 rounded-full bg-[#EAF3DE] text-[#3B6D11] flex items-center justify-center shrink-0">
                            <Icon.checkCircle width={15} height={15} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#3B6D11] tracking-tight mb-1">{counts.approved}</p>
                    <p className="text-xs font-medium text-[#5B6472]">Assignments approved</p>
                </div>

                <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <p className="font-semibold text-[#101F38] text-sm">Rejected</p>
                        <div className="w-8 h-8 rounded-full bg-[#FCEBEB] text-[#A32D2D] flex items-center justify-center shrink-0">
                            <Icon.xCircle width={15} height={15} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#A32D2D] tracking-tight mb-1">{counts.denied}</p>
                    <p className="text-xs font-medium text-[#5B6472]">Requests declined</p>
                </div>

                <div className="rounded-3xl border border-[#ECE9E2] bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                        <p className="font-semibold text-[#101F38] text-sm">Total</p>
                        <div className="w-8 h-8 rounded-full bg-[#FBEAE4] text-[#E3755D] flex items-center justify-center shrink-0">
                            <Icon.file width={15} height={15} />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-[#E3755D] tracking-tight mb-1">{counts.total}</p>
                    <p className="text-xs font-medium text-[#5B6472]">All requests</p>
                </div>
            </div>

            {/* Panel */}
            <div className="bg-white rounded-3xl border border-[#ECE9E2] shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-6 border-b border-[#ECE9E2]">
                    <div>
                        <h2 className="text-lg font-bold text-[#101F38]">Assignment Requests</h2>
                        <p className="text-[#5B6472] text-xs font-medium mt-1">Review and respond to case assignment requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none bg-white border border-[#ECE9E2] rounded-full pl-4 pr-10 py-2.5 text-sm font-semibold text-[#101F38] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 cursor-pointer"
                            >
                                {FILTERS.map((f, i) => <option key={i}>{f}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#5B6472]">
                                <Icon.chevronDown width={15} height={15} />
                            </div>
                        </div>

                        <div className="relative">
                            <select value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)} className="appearance-none bg-white border border-[#ECE9E2] rounded-full pl-4 pr-10 py-2.5 text-sm text-[#101F38]">
                                <option value="all">All managers</option>
                                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-white border border-[#ECE9E2] rounded-full px-3 py-2 text-sm" />
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-white border border-[#ECE9E2] rounded-full px-3 py-2 text-sm" />

                        <button onClick={() => {
                            setFilter('All Requests');
                            setManagerFilter('all');
                            setDateFrom('');
                            setDateTo('');
                            loadRequests(1);
                        }} className="rounded-full border border-[#ECE9E2] text-[#101F38] px-4 py-2 text-sm">Reset</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#ECE9E2] bg-[#F7F5F0]">
                                <th className="px-6 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Case ID</th>
                                <th className="px-4 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Requested By</th>
                                <th className="px-4 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Role</th>
                                <th className="px-4 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Priority</th>
                                <th className="px-4 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Status</th>
                                <th className="px-4 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-[#5B6472] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#ECE9E2]">
                            {filtered.map((req, i) => (
                                <tr key={req.id} className="hover:bg-[#F7F5F0] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-[#101F38]">{req.application?.receipt_number || `APP-${req.application_id}`}</p>
                                        <p className="text-xs font-medium text-[#5B6472] mt-0.5">{req.application?.user?.name} &bull; {req.application?.title}</p>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-semibold text-[#5B6472] whitespace-nowrap">{req.manager?.name}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAEEDA] text-[#854F0B]`}>
                                            Medium
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_META[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-[#5B6472] whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/assignment-requests/${req.id}`} className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3.5 py-2 hover:bg-[#F7F5F0] transition-colors">View</Link>
                                            <button onClick={() => setModalRequest(req)} className="text-xs font-semibold text-[#101F38] border border-[#ECE9E2] rounded-full px-3.5 py-2 hover:bg-[#F7F5F0] transition-colors">Manage</button>
                                            {req.status === "Pending" ? (
                                                <>
                                                    <button onClick={() => handleAction(req.id, 'Denied')} className="w-9 h-9 rounded-full border border-[#ECE9E2] text-[#A32D2D] hover:border-[#A32D2D] hover:bg-[#FCEBEB] flex items-center justify-center transition-colors bg-white">
                                                        <Icon.x width={15} height={15} />
                                                    </button>
                                                    <button onClick={() => handleAction(req.id, 'Approved')} className="w-9 h-9 rounded-full bg-[#E3755D] text-white hover:bg-[#D1644C] shadow-sm flex items-center justify-center transition-colors">
                                                        <Icon.check width={15} height={15} />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs font-semibold text-[#5B6472]">Action taken</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!loading && filtered.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center gap-3">
                                            <div className="w-11 h-11 rounded-full border border-[#ECE9E2] text-[#5B6472] flex items-center justify-center">
                                                <Icon.alert width={20} height={20} />
                                            </div>
                                            <p className="text-sm font-semibold text-[#5B6472]">No assignment requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 bg-white border-t border-[#ECE9E2] flex items-center justify-between">
                    <div className="text-sm text-[#5B6472]">Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}</div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => loadRequests(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded-md border border-[#ECE9E2] text-sm">Prev</button>
                        <span className="text-sm text-[#5B6472]">{page} / {lastPage}</span>
                        <button onClick={() => loadRequests(Math.min(lastPage, page + 1))} disabled={page === lastPage} className="px-3 py-1 rounded-md border border-[#ECE9E2] text-sm">Next</button>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {modalRequest && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg bg-white rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#101F38]">Manage Request #{modalRequest.id}</h3>
                                <p className="text-xs text-[#5B6472]">Application {modalRequest.application?.receipt_number}</p>
                            </div>
                            <button onClick={() => setModalRequest(null)} className="text-sm text-[#5B6472]">Close</button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-[#5B6472]">Requested by: <span className="font-semibold text-[#101F38]">{modalRequest.manager?.name}</span></p>
                            <p className="text-sm text-[#5B6472] mt-2">Notes: <span className="text-[#5B6472]">{modalRequest.notes || '—'}</span></p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => { handleAction(modalRequest.id, 'Denied'); setModalRequest(null); }} className="px-4 py-2 rounded-md border border-[#ECE9E2] text-[#A32D2D]">Deny</button>
                            <button onClick={() => { handleAction(modalRequest.id, 'Approved'); setModalRequest(null); }} className="px-4 py-2 rounded-md bg-[#E3755D] text-white">Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}