import React from 'react';
import Link from 'next/link';

export default function AdminRolesPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Roles & Permissions</h1>
                    <p className="text-gray-500 mt-2 font-medium">Define access levels and configure security permissions for your team.</p>
                </div>
                <Link href="/admin/roles/new" className="bg-[#111827] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Create Role</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Col: Role List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border-2 border-[#1B3A64] p-4 shadow-sm cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1B3A64]"></div>
                        <h3 className="font-bold text-[#1B3A64] text-sm">Super Admin</h3>
                        <p className="text-xs text-gray-500 mt-1">Full system access</p>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-[#1B3A64]/50 cursor-pointer transition-colors group">
                        <h3 className="font-bold text-gray-700 group-hover:text-[#1B3A64] text-sm">Case Manager</h3>
                        <p className="text-xs text-gray-500 mt-1">Manage cases and clients</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-[#1B3A64]/50 cursor-pointer transition-colors group">
                        <h3 className="font-bold text-gray-700 group-hover:text-[#1B3A64] text-sm">Immigration Lawyer</h3>
                        <p className="text-xs text-gray-500 mt-1">Approve forms and legal review</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-[#1B3A64]/50 cursor-pointer transition-colors group">
                        <h3 className="font-bold text-gray-700 group-hover:text-[#1B3A64] text-sm">Paralegal</h3>
                        <p className="text-xs text-gray-500 mt-1">Data entry and document prep</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-[#1B3A64]/50 cursor-pointer transition-colors group">
                        <h3 className="font-bold text-gray-700 group-hover:text-[#1B3A64] text-sm">Read-Only Viewer</h3>
                        <p className="text-xs text-gray-500 mt-1">Can view cases, no edits</p>
                    </div>
                </div>

                {/* Right Col: Permissions Matrix */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg">Super Admin Permissions</h2>
                                <p className="text-sm text-gray-500 font-medium">These settings apply to 2 users.</p>
                            </div>
                            <Link href="/admin/roles/edit" className="text-sm font-bold text-[#E3755D] hover:text-[#C8634D] transition-colors">Edit Settings</Link>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-8">
                                {/* Section 1 */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#1B3A64] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Case Management</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">View Cases</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Access and read case details and statuses.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">Create & Edit Cases</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Add new cases or modify existing details.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">Delete Cases</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Permanently remove cases from the system.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">Approve Forms</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Final legal sign-off on immigration forms.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#1B3A64] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">System & Billing</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">Manage Billing</p>
                                                <p className="text-xs text-gray-500 mt-0.5">View and process invoices and payments.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-5 h-5 rounded bg-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-bold text-gray-900">Manage Staff</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Invite, edit, or suspend internal users.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
