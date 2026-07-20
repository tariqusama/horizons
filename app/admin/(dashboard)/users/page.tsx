"use client";

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { getUsers, updateUserStatus, deleteUser, resendVerification, User } from '../../../../lib/api/users';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    filter: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
    refresh: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>,
    download: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    userPlus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    more: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>,
    edit: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
    send: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    ban: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>,
    trash: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
};

// users data fetched from API now

export default function AdminUsersPage() {
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const ITEMS_PER_PAGE = 10;

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        return users.filter((user) => {
            const matchesSearch = !query ||
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                (user.phone || '').toLowerCase().includes(query) ||
                (user.country || '').toLowerCase().includes(query) ||
                (user.role || '').toLowerCase().includes(query);
            const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const pageCount = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const pageUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    useEffect(() => {
        if (page > pageCount) {
            setPage(pageCount);
        }
    }, [pageCount, page]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProfile = (user: User) => {
        setOpenMenu(null);
    };

    const handleResendVerification = async (user: User) => {
        try {
            setIsActionLoading(true);
            await resendVerification(user.email);
            alert(`Verification email resent to ${user.email}`);
            setOpenMenu(null);
        } catch (error) {
            console.error('Failed to resend verification:', error);
            alert('Unable to resend verification email.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const exportUsers = () => {
        const csvRows = [
            ['Name', 'Email', 'Phone', 'Country', 'Role', 'Status', 'Joined'],
            ...filteredUsers.map((user) => [
                user.name,
                user.email,
                user.phone || '',
                user.country || '',
                user.role,
                user.status,
                new Date(user.created_at).toLocaleDateString(),
            ]),
        ];

        const csvContent = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users-export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        try {
            await updateUserStatus(user.id, newStatus);
            setOpenMenu(null);
            loadUsers();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            setOpenMenu(null);
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const totalUsers = users.length;
    const staffMembers = users.filter(u => u.role !== "Client" && u.role !== "Read-Only Viewer").length;

    const toggleSelected = (id: number) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-3">Total Users</p>
                        <p className="text-[32px] font-black text-gray-900 leading-none">{totalUsers}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">Registered accounts</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#E3755D]/10 text-[#E3755D] flex items-center justify-center shrink-0">
                        <Icon.userPlus width={17} height={17} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 mb-3">Staff Members</p>
                        <p className="text-[32px] font-black text-gray-900 leading-none">{staffMembers}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">Team members</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#1B3A64]/10 text-[#1B3A64] flex items-center justify-center shrink-0">
                        <Icon.shield width={17} height={17} />
                    </div>
                </div>
            </div>

            {/* Panel */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Panel header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl font-black text-gray-900">User Management</h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">Manage user accounts, roles, and permissions &bull; {totalUsers} total users</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadUsers}
                            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            <Icon.refresh width={15} height={15} />
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button
                            onClick={exportUsers}
                            className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Icon.download width={15} height={15} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Search + filter */}
                <div className="flex gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search by name or email..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 shadow-sm font-medium text-gray-900"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Icon.search width={16} height={16} />
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFilters((prev) => !prev)}
                        className="flex items-center justify-center w-11 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
                        aria-label="Toggle filters"
                    >
                        <Icon.filter width={16} height={16} />
                    </button>
                </div>

                {showFilters && (
                    <div className="px-6 pb-4 border-b border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">Role</label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50"
                                >
                                    <option>All Roles</option>
                                    <option>Super Admin</option>
                                    <option>Immigration Attorney</option>
                                    <option>Case Manager</option>
                                    <option>Paralegal</option>
                                    <option>Client</option>
                                    <option>Read-Only Viewer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50"
                                >
                                    <option>All Statuses</option>
                                    <option>Active</option>
                                    <option>Suspended</option>
                                </select>
                            </div>
                            <div className="flex items-end justify-between gap-3">
                                <button
                                    onClick={() => {
                                        setRoleFilter('All Roles');
                                        setStatusFilter('All Statuses');
                                        setSearch('');
                                        setPage(1);
                                    }}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Reset filters
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full bg-[#E3755D] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#C8634D] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="pl-6 pr-2 py-4 w-10">
                                    <input type="checkbox" className="w-4 h-4 rounded-full border-gray-300 accent-[#E3755D]" />
                                </th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pageUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors group relative">
                                    <td className="pl-6 pr-2 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(user.id)}
                                            onChange={() => toggleSelected(user.id)}
                                            className="w-4 h-4 rounded-full border-gray-300 accent-[#E3755D]"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${user.color} text-white flex items-center justify-center font-bold text-xs shadow-inner mr-3 shrink-0`}>
                                                {user.initials}
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{user.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{user.email}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-400 whitespace-nowrap">{user.phone || 'No phone'}</td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-400 whitespace-nowrap">{user.country || 'No country'}</td>
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border border-gray-200 text-gray-600 uppercase tracking-wide">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button
                                            onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                                            className="text-gray-400 hover:text-gray-900 transition-colors p-1"
                                        >
                                            <Icon.more width={18} height={18} />
                                        </button>

                                        {openMenu === user.id && (
                                            <div className="absolute right-6 top-12 z-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 text-left">
                                                <Link href={`/admin/users/${user.id}/edit`} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                    <Icon.edit width={14} height={14} />
                                                    Edit Profile
                                                </Link>
                                                <button
                                                    onClick={() => handleResendVerification(user)}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                                    disabled={isActionLoading}
                                                >
                                                    <Icon.send width={14} height={14} />
                                                    {isActionLoading ? 'Sending...' : 'Resend Verification'}
                                                </button>
                                                <button onClick={() => handleToggleStatus(user)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                                                    <Icon.ban width={14} height={14} />
                                                    {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                                </button>
                                                <div className="my-1 border-t border-gray-100" />
                                                <button onClick={() => handleDelete(user.id)} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50">
                                                    <Icon.trash width={14} height={14} />
                                                    Delete User
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white">
                    <span className="text-sm text-gray-500 font-medium">
                        Showing {pageUsers.length ? startIndex + 1 : 0} - {startIndex + pageUsers.length} of {filteredUsers.length} matching users
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === 1 ? 'border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                            disabled={page === pageCount}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${page === pageCount ? 'border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}