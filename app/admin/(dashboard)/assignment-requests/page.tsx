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
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="mb-6 px-1">
                <h1 className="text-2xl font-bold text-slate-900">Assignment Requests</h1>
                <p className="text-sm text-slate-600 mt-1">Review and manage case assignment requests</p>
            </div>

            <div className="space-y-6">

                {/* Stat Cards with Gradients */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Pending Card */}
                    <div className="rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br from-yellow-500/10 via-background to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Pending</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm">
                                <Icon.clock className="h-4 w-4 text-yellow-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative z-10">
                            <div className="text-3xl font-bold bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent">{counts.pending}</div>
                            <p className="text-xs text-slate-600 mt-1">Awaiting review</p>
                        </div>
                    </div>

                    {/* Approved Card */}
                    <div className="rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-background to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-green-500/20 to-emerald-500/20 rounded-full blur-2xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Approved</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
                                <Icon.checkCircle className="h-4 w-4 text-green-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative z-10">
                            <div className="text-3xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">{counts.approved}</div>
                            <p className="text-xs text-slate-600 mt-1">Assignments approved</p>
                        </div>
                    </div>

                    {/* Rejected Card */}
                    <div className="rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br from-red-500/10 via-background to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-red-500/20 to-pink-500/20 rounded-full blur-2xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Rejected</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm">
                                <Icon.xCircle className="h-4 w-4 text-red-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative z-10">
                            <div className="text-3xl font-bold bg-gradient-to-br from-red-600 to-pink-600 bg-clip-text text-transparent">{counts.denied}</div>
                            <p className="text-xs text-slate-600 mt-1">Requests declined</p>
                        </div>
                    </div>

                    {/* Total Card */}
                    <div className="rounded-lg bg-card text-card-foreground relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-background to-background shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Total</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
                                <Icon.file className="h-4 w-4 text-blue-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative z-10">
                            <div className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">{counts.total}</div>
                            <p className="text-xs text-slate-600 mt-1">All requests</p>
                        </div>
                    </div>
                </div>

                {/* Requests Table Section */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold leading-none tracking-tight text-slate-900">Assignment Requests</h3>
                                <p className="text-sm text-slate-600 mt-1">Review and respond to case assignment requests</p>
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="flex h-10 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-[180px] cursor-pointer"
                            >
                                {FILTERS.map((f, i) => <option key={i}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="p-6 pt-0">
                        <div className="rounded-md border border-slate-200 overflow-hidden">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full min-w-[1000px] caption-bottom text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="h-12 px-6 py-3 text-left align-middle font-semibold text-slate-700 flex-1">Case ID</th>
                                            <th className="h-12 px-4 py-3 text-left align-middle font-semibold text-slate-700 w-32">Requested By</th>
                                            <th className="h-12 px-4 py-3 text-center align-middle font-semibold text-slate-700 w-24">Role</th>
                                            <th className="h-12 px-4 py-3 text-center align-middle font-semibold text-slate-700 w-24">Priority</th>
                                            <th className="h-12 px-4 py-3 text-center align-middle font-semibold text-slate-700 w-24">Status</th>
                                            <th className="h-12 px-4 py-3 text-center align-middle font-semibold text-slate-700 w-28">Created</th>
                                            <th className="h-12 px-6 py-3 text-right align-middle font-semibold text-slate-700 w-auto">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filtered.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 align-middle flex-1">
                                                    <p className="text-sm font-semibold text-slate-900">{req.application?.receipt_number || `APP-${req.application_id}`}</p>
                                                    <p className="text-xs text-slate-600 mt-0.5">{req.application?.user?.name} • {req.application?.title}</p>
                                                </td>
                                                <td className="px-4 py-4 align-middle text-sm font-medium text-slate-700 w-32 truncate">{req.manager?.name}</td>
                                                <td className="px-4 py-4 align-middle text-center w-24">
                                                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white whitespace-nowrap">
                                                        Medium
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 align-middle text-center w-24">
                                                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white whitespace-nowrap">
                                                        Low
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 align-middle text-center w-24">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${STATUS_META[req.status]}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 align-middle text-center text-sm text-slate-700 w-28 whitespace-nowrap">{new Date(req.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 align-middle text-right w-auto">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/admin/assignment-requests/${req.id}`} className="text-xs font-semibold text-slate-700 border border-slate-300 rounded-md px-2.5 py-1.5 hover:bg-slate-50 transition-colors whitespace-nowrap">View</Link>
                                                        <button onClick={() => setModalRequest(req)} className="text-xs font-semibold text-slate-700 border border-slate-300 rounded-md px-2.5 py-1.5 hover:bg-slate-50 transition-colors whitespace-nowrap">Manage</button>
                                                        {req.status === "Pending" ? (
                                                            <>
                                                                <button onClick={() => handleAction(req.id, 'Denied')} className="w-8 h-8 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0">
                                                                    <Icon.x width={16} height={16} />
                                                                </button>
                                                                <button onClick={() => handleAction(req.id, 'Approved')} className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg flex items-center justify-center transition-all flex-shrink-0">
                                                                    <Icon.check width={16} height={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Done</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                        {(!loading && filtered.length === 0) && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-4 align-middle text-center py-12">
                                                    <div className="flex flex-col items-center gap-2 text-slate-600">
                                                        <Icon.alert className="h-8 w-8 text-slate-400" />
                                                        <p className="text-sm font-medium">No assignment requests found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalRequest && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg bg-white rounded-lg p-6 border border-slate-200 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Manage Request #{modalRequest.id}</h3>
                                <p className="text-xs text-slate-600 mt-1">Application {modalRequest.application?.receipt_number}</p>
                            </div>
                            <button onClick={() => setModalRequest(null)} className="text-sm text-slate-600 hover:text-slate-900">Close</button>
                        </div>

                        <div className="mb-6 py-4 border-y border-slate-200">
                            <p className="text-sm text-slate-700">Requested by: <span className="font-semibold text-slate-900">{modalRequest.manager?.name}</span></p>
                            <p className="text-sm text-slate-700 mt-2">Notes: <span className="text-slate-600">{modalRequest.notes || '—'}</span></p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => { handleAction(modalRequest.id, 'Denied'); setModalRequest(null); }} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors">Deny</button>
                            <button onClick={() => { handleAction(modalRequest.id, 'Approved'); setModalRequest(null); }} className="px-4 py-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg font-medium text-sm transition-all">Approve</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}