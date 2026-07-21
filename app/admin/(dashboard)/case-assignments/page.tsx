"use client";

import React, { useState, useRef, useEffect } from 'react';
import { getCases, assignCaseManager, Application } from '@/lib/api/cases';
import { getUsers, User } from '../../../../lib/api/users';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    userCog: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><circle cx="19" cy="16" r="2" /><path d="M19 12v1M19 19v1M22 16h-1M17 16h-1" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
};

function AssignDropdown({
    value,
    managers,
    onChange,
}: {
    value: number | null;
    managers: User[];
    onChange: (v: number | null) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative w-56" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm hover:border-gray-300 transition-colors"
            >
                <span className={value ? "text-gray-900" : "text-gray-400 italic font-medium"}>
                    {value ? managers.find(m => m.id === value)?.name : "Unassigned"}
                </span>
                <Icon.chevronDown width={14} height={14} className="text-gray-400 shrink-0" />
            </button>

            {open && (
                <div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-64 overflow-auto">
                    <button
                        onClick={() => { onChange(null); setOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-bold text-left ${value === null ? "bg-[#1B3A64] text-white" : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <span className="w-3.5 shrink-0">{value === null && <Icon.check width={12} height={12} />}</span>
                        Unassigned
                    </button>
                    {managers.map((m, i) => (
                        <button
                            key={i}
                            onClick={() => { onChange(m.id); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-left ${value === m.id ? "bg-[#1B3A64] text-white" : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <span className="w-3.5 shrink-0">{value === m.id && <Icon.check width={12} height={12} />}</span>
                            {m.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminCaseAssignmentsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [cases, setCases] = useState<Application[]>([]);
    const [managers, setManagers] = useState<User[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [casesData, usersData] = await Promise.all([getCases(), getUsers()]);
            setCases(casesData);
            // Only include users with the "Case Manager" role
            setManagers(usersData.filter(u => ((u.role || '').toLowerCase().includes('case manager'))));
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleAssign = async (caseId: number, managerId: number | null) => {
        try {
            await assignCaseManager(caseId, managerId);
            loadData();
        } catch (error) {
            console.error('Failed to assign manager:', error);
            alert('Failed to assign manager');
        }
    };

    const filteredCases = cases.filter(c => {
        const clientEmail = c.user?.email || '';
        return search.trim() === "" || clientEmail.toLowerCase().includes(search.toLowerCase());
    });

    const ITEMS_PER_PAGE = 8;
    const pageCount = Math.max(1, Math.ceil(filteredCases.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageCases = filteredCases.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount);
        }
    }, [pageCount, page]);

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="mb-6">
                <h1 className="text-2xl md:text-[28px] font-black text-gray-900 tracking-tight mb-1">Case Assignments</h1>
                <p className="text-gray-500 font-medium text-sm">Assign clients' cases to specific case managers. Admin only.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 px-6 py-6 border-b border-gray-100">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-[#E3755D]">
                                <Icon.userCog width={20} height={20} />
                            </span>
                            <h2 className="text-lg font-black text-gray-900">Assign Clients to Case Managers</h2>
                        </div>
                        <p className="text-sm text-gray-500 font-medium max-w-xl">
                            Only admins can assign a client to a specific case manager. Case managers only see clients assigned to them.
                        </p>
                    </div>
                    <div className="relative w-full md:w-64 shrink-0">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search clients..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#E3755D] focus:bg-white transition-colors"
                        />
                        <Icon.search width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 pt-5 pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 pt-5 pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Case Manager</th>
                                <th className="px-6 pt-5 pb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Assign</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageCases.map((c) => {
                                const manager = managers.find(m => m.id === c.manager_id);
                                return (
                                    <tr key={c.id}>
                                        <td className="px-6 py-4 align-top">
                                            <p className="font-bold text-gray-900 text-sm">{c.user?.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{c.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            {manager ? (
                                                <>
                                                    <p className="font-bold text-gray-900 text-sm">{manager.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{manager.email}</p>
                                                </>
                                            ) : (
                                                <p className="italic text-gray-400 text-sm">Unassigned</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <AssignDropdown
                                                value={c.manager_id}
                                                managers={managers}
                                                onChange={(v) => handleAssign(c.id, v)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}

                            {pageCases.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-gray-400">
                                        No clients match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">
                        Showing {pageCases.length ? startIndex + 1 : 0} - {startIndex + pageCases.length} of {filteredCases.length} cases
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === 1 ? 'border border-gray-200 bg-gray-100 text-gray-400' : 'border border-gray-200 bg-white text-[#101F38] hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === pageCount ? 'border border-gray-200 bg-gray-100 text-gray-400' : 'border border-gray-200 bg-white text-[#101F38] hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}