"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ManageUserRolesModal from './new/page';
import { getUsers, updateUserRole, User } from '../../../../lib/api/users';

const Icon = {
    refresh: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    plus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    trash: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
};

// Fetched dynamically now

export default function AdminRolesPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const handleRevoke = async (id: number) => {
        if (!confirm('Are you sure you want to revoke this role?')) return;
        try {
            await updateUserRole(id, 'Client');
            loadUsers();
        } catch (error) {
            console.error('Failed to revoke role:', error);
        }
    };

    const assignments = users.filter(u => u.role !== 'Client' && u.role !== 'Read-Only Viewer').map(u => ({
        id: u.id,
        user: u.name,
        email: u.email,
        role: u.role,
        assigned: new Date(u.created_at).toLocaleDateString(),
        status: u.status
    }));

    const roleStats = [
        { name: "Super Admin", count: assignments.filter(a => a.role === "Super Admin").length },
        { name: "Immigration Attorney", count: assignments.filter(a => a.role === "Immigration Attorney").length },
        { name: "Case Manager", count: assignments.filter(a => a.role === "Case Manager").length },
        { name: "Paralegal", count: assignments.filter(a => a.role === "Paralegal").length },
    ];

    const ROLE_META: Record<string, { bg: string; text: string }> = {
        "Super Admin": { bg: "bg-[#E3755D]", text: "text-white" },
        "Immigration Attorney": { bg: "bg-[#1B3A64]/10", text: "text-[#1B3A64]" },
        "Case Manager": { bg: "bg-[#3B66A5]/10", text: "text-[#3B66A5]" },
        "Paralegal": { bg: "bg-[#D6497A]/10", text: "text-[#D6497A]" },
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesSearch = search.trim() === "" ||
            a.user.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "All Roles" || a.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const ITEMS_PER_PAGE = 8;
    const pageCount = Math.max(1, Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageAssignments = filteredAssignments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount);
        }
    }, [pageCount, page]);

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Role Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage user roles and permissions across the system</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                    <Icon.refresh width={15} height={15} />
                    Refresh
                </button>
            </div>

            {/* Role stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {roleStats.map((r, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="font-bold text-gray-900 text-sm">{r.name}</h3>
                            <div className="text-gray-400">
                                <Icon.users width={16} height={16} />
                            </div>
                        </div>
                        <p className="text-[28px] font-black text-gray-900 leading-none">{r.count}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">Active assignments</p>
                    </div>
                ))}
            </div>

            {/* Role Assignments panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Role Assignments</h2>
                        <p className="text-gray-500 mt-1 text-sm font-medium">View and manage all role assignments</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#E3755D] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#C8634D] transition-colors shadow-sm w-fit">
                        <Icon.plus width={15} height={15} />
                        Assign Role
                    </button>
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 shadow-sm font-medium text-gray-900"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Icon.search width={16} height={16} />
                        </div>
                    </div>
                    <div className="relative">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 cursor-pointer"
                        >
                            <option>All Roles</option>
                            {roleStats.map((r, i) => <option key={i}>{r.name}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                            <Icon.chevronDown width={15} height={15} />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageAssignments.map((a, idx) => {
                                const meta = ROLE_META[a.role] ?? { bg: "bg-gray-200", text: "text-gray-700" };
                                return (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{a.user}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#3B66A5] whitespace-nowrap">{a.email}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text} whitespace-nowrap`}>
                                                <Icon.shield width={11} height={11} />
                                                {a.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{a.assigned}</td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#E3755D] text-white">
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-4">
                                                <button onClick={() => handleRevoke(a.id)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                                    Revoke
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {pageAssignments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm font-medium text-gray-400">
                                        No role assignments match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-sm text-gray-500">
                        Showing {pageAssignments.length ? startIndex + 1 : 0} - {startIndex + pageAssignments.length} of {filteredAssignments.length} role assignments
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === 1 ? 'border border-gray-200 bg-gray-100 text-gray-400' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === pageCount ? 'border border-gray-200 bg-gray-100 text-gray-400' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {isModalOpen && <ManageUserRolesModal onClose={() => { setIsModalOpen(false); loadUsers(); }} />}
        </div>
    );
}
