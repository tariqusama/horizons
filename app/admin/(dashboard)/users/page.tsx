import React from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage agency staff, their roles, and system access levels.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="w-[250px] bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 shadow-sm font-medium text-gray-900"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>
                    <Link href="/admin/users/invite" className="bg-[#111827] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Invite User</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { name: "Sarah Jones", email: "sarah.j@horizonpathways.us", role: "Super Admin", status: "Active", lastLogin: "2 hours ago", initials: "SJ", color: "from-[#E3755D] to-[#C8634D]" },
                                { name: "David Miller", email: "david.m@horizonpathways.us", role: "Case Manager", status: "Active", lastLogin: "Yesterday", initials: "DM", color: "from-[#1B3A64] to-[#3B66A5]" },
                                { name: "Rachel Adams", email: "rachel.a@horizonpathways.us", role: "Immigration Lawyer", status: "Active", lastLogin: "3 days ago", initials: "RA", color: "from-[#1B3A64] to-[#3B66A5]" },
                                { name: "Marcus Johnson", email: "marcus.j@horizonpathways.us", role: "Paralegal", status: "Active", lastLogin: "1 week ago", initials: "MJ", color: "from-[#1B3A64] to-[#3B66A5]" },
                                { name: "Jessica Lee", email: "jessica.l@horizonpathways.us", role: "Read-Only Viewer", status: "Suspended", lastLogin: "2 months ago", initials: "JL", color: "from-gray-400 to-gray-600" }
                            ].map((user, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${user.color} text-white flex items-center justify-center font-bold text-sm shadow-inner mr-4`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-[#1B3A64] transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                </svg>
                                            </button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <span className="text-sm text-gray-500 font-medium">Showing 5 of 12 staff members</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
