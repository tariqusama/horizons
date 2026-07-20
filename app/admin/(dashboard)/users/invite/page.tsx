'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUser } from '../../../../../lib/api/users';

function generateTempPassword() {
    return (
        Math.random().toString(36).slice(2, 10) +
        Math.random().toString(36).slice(2, 6)
    );
}

export default function InviteUserPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('manager');
    const [sendWelcome, setSendWelcome] = useState(true);
    const [grantImmediateAccess, setGrantImmediateAccess] = useState(false);
    const [requirePasswordChange, setRequirePasswordChange] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!email || !firstName || !lastName || !role) {
            setError('Please complete all required fields before sending the invitation.');
            return;
        }

        setIsSubmitting(true);

        const password = generateTempPassword();
        try {
            await createUser({
                name: `${firstName} ${lastName}`,
                email,
                password,
                role,
                phone: phone || null,
                country: '',
            });

            setSuccessMessage(`Team member invited successfully. Temporary password: ${password}`);
            setTimeout(() => router.push('/admin/users'), 1200);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to invite team member.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto w-full pb-12">
            {/* Back Button */}
            <Link href="/admin/users" className="flex items-center text-[#E3755D] font-bold text-sm mb-8 hover:text-[#C8634D] transition-colors group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Users
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Invite Team Member</h1>
                <p className="text-gray-500 mt-2 font-medium">Send an invitation to a new team member. They'll receive an email to set up their account.</p>
            </div>

            {error ? (
                <div className="mb-6 rounded-2xl border border-[#F0C4C4] bg-[#FCEBEB] p-4 text-sm text-[#A32D2D]">{error}</div>
            ) : null}
            {successMessage ? (
                <div className="mb-6 rounded-2xl border border-[#CDE7D8] bg-[#E9F8EF] p-4 text-sm text-[#1B5F39]">{successMessage}</div>
            ) : null}

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Invitation Details */}
                    <div>
                        <h2 className="text-lg font-black text-gray-900 mb-6">Team Member Details</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="newmember@horizonpathways.us"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-2">Use a company email address</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        placeholder="First name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        placeholder="Last name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Assignment */}
                    <div className="pt-6 border-t border-gray-100">
                        <h2 className="text-lg font-black text-gray-900 mb-6">Role & Permissions</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-4">Assign Role *</label>
                            <div className="space-y-3">
                                <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer hover:border-[#E3755D]/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="super-admin"
                                        checked={role === 'super-admin'}
                                        onChange={() => setRole('super-admin')}
                                        className="w-4 h-4 mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Super Admin</p>
                                        <p className="text-xs text-gray-500 mt-1">Full system access, manage all settings and users</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer hover:border-[#E3755D]/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="manager"
                                        checked={role === 'manager'}
                                        onChange={() => setRole('manager')}
                                        className="w-4 h-4 mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Case Manager</p>
                                        <p className="text-xs text-gray-500 mt-1">Manage cases and clients, access to analytics</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer hover:border-[#E3755D]/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="immigration-attorney"
                                        checked={role === 'immigration-attorney'}
                                        onChange={() => setRole('immigration-attorney')}
                                        className="w-4 h-4 mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Immigration Lawyer</p>
                                        <p className="text-xs text-gray-500 mt-1">Approve forms, legal reviews, case validation</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer hover:border-[#E3755D]/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="paralegal"
                                        checked={role === 'paralegal'}
                                        onChange={() => setRole('paralegal')}
                                        className="w-4 h-4 mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Paralegal</p>
                                        <p className="text-xs text-gray-500 mt-1">Data entry, document preparation, form filing</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer hover:border-[#E3755D]/50 transition-colors">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="viewer"
                                        checked={role === 'viewer'}
                                        onChange={() => setRole('viewer')}
                                        className="w-4 h-4 mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Read-Only Viewer</p>
                                        <p className="text-xs text-gray-500 mt-1">View cases and reports, no editing permissions</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="pt-6 border-t border-gray-100">
                        <h2 className="text-lg font-black text-gray-900 mb-6">Additional Options</h2>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={sendWelcome}
                                    onChange={(e) => setSendWelcome(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Send welcome email with setup instructions</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={grantImmediateAccess}
                                    onChange={(e) => setGrantImmediateAccess(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Grant immediate access (skip email verification)</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={requirePasswordChange}
                                    onChange={(e) => setRequirePasswordChange(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Require password change on first login</span>
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-100">
                        <Link href="/admin/users" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'Inviting…' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                        <h3 className="font-bold text-[#1B3A64] text-sm">Invitation Details</h3>
                        <p className="text-xs text-[#1B3A64]/75 mt-1">The invitation will expire in 7 days. The team member will receive an email with instructions to create their account and set a password.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
