import React from 'react';
import Link from 'next/link';

export default function CreateRolePage() {
    return (
        <div className="max-w-[1000px] mx-auto w-full pb-12">
            {/* Back Button */}
            <Link href="/admin/roles" className="flex items-center text-[#E3755D] font-bold text-sm mb-8 hover:text-[#C8634D] transition-colors group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 group-hover:-translate-x-1 transition-transform">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Roles
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Create New Role</h1>
                <p className="text-gray-500 mt-2 font-medium">Define a new role with specific permissions and access levels for your team.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <form className="space-y-8">
                        {/* Role Information Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Role Information</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Role Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Senior Case Manager"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-2">Use a descriptive name that clearly indicates the role's responsibility</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Role Description *</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Describe the purpose of this role and its main responsibilities..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E3755D]/20 focus:border-[#E3755D] bg-gray-50 font-medium text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                            <h2 className="text-lg font-black text-gray-900 mb-6">Permissions</h2>

                            {/* Dashboard Permissions */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                    Dashboard
                                </h3>
                                <div className="space-y-3 ml-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">View Dashboard</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">View Analytics & Reports</span>
                                    </label>
                                </div>
                            </div>

                            {/* Case Permissions */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Case Management
                                </h3>
                                <div className="space-y-3 ml-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">View Cases</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Create Cases</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Edit Cases</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Delete Cases</span>
                                    </label>
                                </div>
                            </div>

                            {/* Client Permissions */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    Client Management
                                </h3>
                                <div className="space-y-3 ml-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                                        <span className="text-sm font-medium text-gray-700">View Clients</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Create Clients</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Edit Clients</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Delete Clients</span>
                                    </label>
                                </div>
                            </div>

                            {/* User Management */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    User Management
                                </h3>
                                <div className="space-y-3 ml-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">View Users</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Invite Users</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Edit User Roles</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Remove Users</span>
                                    </label>
                                </div>
                            </div>

                            {/* Settings */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-1.78 7.78l-4.24-4.24m-3.08-3.08l-4.24-4.24"></path>
                                    </svg>
                                    System Settings
                                </h3>
                                <div className="space-y-3 ml-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Manage Roles</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">Configure System Settings</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4" />
                                        <span className="text-sm font-medium text-gray-700">View Activity Logs</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between items-center gap-4">
                            <Link href="/admin/roles" className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="submit" className="px-8 py-3 rounded-lg bg-[#1B3A64] text-white font-bold text-sm hover:bg-[#122846] transition-colors shadow-lg">
                                Create Role
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E3755D]">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Tips
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Use clear role names that reflect the user's responsibilities</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Start with minimal permissions and add as needed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Review permissions monthly for security</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#E3755D] font-bold mt-0.5">•</span>
                                <span>Document role creation for audit purposes</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                        <h3 className="font-bold text-orange-900 text-sm mb-2">Permission Guidelines</h3>
                        <p className="text-xs text-orange-800 leading-relaxed">
                            Ensure roles follow the principle of least privilege. Only grant permissions necessary for the role's function.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
