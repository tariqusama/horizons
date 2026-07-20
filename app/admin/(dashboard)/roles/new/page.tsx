"use client";

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUserRole, User } from '../../../../../lib/api/users';

const Icon = {
    close: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    userPlus: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
    eye: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    eyeOff: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
};

const ROLE_OPTIONS = [
    { value: 'super-admin', label: 'Super Admin', description: 'Full system access' },
    { value: 'immigration-attorney', label: 'Immigration Attorney', description: 'Review and approve cases' },
    { value: 'case-manager', label: 'Case Manager', description: 'Manage client cases' },
    { value: 'printing-team', label: 'Printing Team', description: 'Handle printing operations' },
];

type Tab = "existing" | "new";

export default function ManageUserRolesModal({ onClose, userId }: { onClose?: () => void; userId?: number }) {
    const [tab, setTab] = useState<Tab>(userId ? "existing" : "new");
    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const [selectedUserId, setSelectedUserId] = useState<number | ''>(userId ?? '');
    const [role, setRole] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        getUsers().then(setUsers).catch(console.error);
    }, []);

    useEffect(() => {
        if (userId) {
            setSelectedUserId(userId);
            setTab('existing');
        }
    }, [userId]);

    const handleAssign = async () => {
        if (!selectedUserId || !role) return alert('Please select a user and a role');
        try {
            await updateUserRole(Number(selectedUserId), role);
            if (onClose) onClose();
        } catch (error) {
            console.error('Failed to assign role:', error);
            alert('Failed to assign role');
        }
    };

    const handleCreate = async () => {
        if (!firstName || !lastName || !email || !password || !role) return alert('Please fill out all fields');
        try {
            await createUser({
                name: `${firstName} ${lastName}`,
                email,
                password,
                role
            });
            if (onClose) onClose();
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-5">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Manage User Roles</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Assign roles to existing users or create new user accounts with roles</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 ml-4">
                        <Icon.close width={18} height={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6">
                    <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setTab("existing")}
                            className={`py-2.5 rounded-md text-sm font-bold transition-colors ${tab === "existing" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Assign to Existing User
                        </button>
                        <button
                            onClick={() => setTab("new")}
                            className={`py-2.5 rounded-md text-sm font-bold transition-colors ${tab === "new" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Create New User
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-5">
                    {tab === "existing" ? (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">User Email</label>
                                <div className="relative">
                                    <select
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(Number(e.target.value) || '')}
                                        className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900 cursor-pointer"
                                    >
                                        <option value="" disabled>Select a user</option>
                                        {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                        <Icon.chevronDown width={16} height={16} />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">The user must already have a registered account</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900 cursor-pointer"
                                    >
                                        <option value="" disabled>Select a role to assign</option>
                                        {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                        <Icon.chevronDown width={16} height={16} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name <span className="text-[#E3755D]">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name <span className="text-[#E3755D]">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address <span className="text-[#E3755D]">*</span></label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@horizonpathways.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Password <span className="text-[#E3755D]">*</span></label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <Icon.eyeOff width={16} height={16} /> : <Icon.eye width={16} height={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Password must be at least 8 characters long</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-white font-medium text-gray-900 cursor-pointer"
                                    >
                                        <option value="" disabled>Select a role for the new user</option>
                                        {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                                        <Icon.chevronDown width={16} height={16} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-6 pb-6 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    {tab === "existing" ? (
                        <button onClick={handleAssign} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E3755D] text-white font-bold text-sm hover:bg-[#C8634D] transition-colors shadow-sm">
                            <Icon.shield width={15} height={15} />
                            Assign Role
                        </button>
                    ) : (
                        <button onClick={handleCreate} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#E3755D] text-white font-bold text-sm hover:bg-[#C8634D] transition-colors shadow-sm">
                            <Icon.userPlus width={15} height={15} />
                            Create & Assign Role
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}