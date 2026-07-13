import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back! Here's what's happening at Horizon Pathways today.</p>
                </div>
                <Link href="/admin/clients/new" className="bg-[#111827] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>New Client</span>
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">+12%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Active Clients</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">2,405</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-[#E3755D] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">+5%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Active Cases</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">1,832</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-md">-2%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Pending Review</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">84</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">+24%</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Monthly Revenue</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">$45.2K</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority Cases */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Priority Cases</h2>
                        <Link href="/admin/cases" className="text-sm text-[#E3755D] font-semibold hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Maria Rodriguez</p>
                                        <p className="text-xs text-gray-500">maria.r@example.com</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">Marriage Green Card</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                            RFE Received
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-red-500">
                                        In 2 Days
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Wei Chen</p>
                                        <p className="text-xs text-gray-500">w.chen@example.com</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">H-1B Visa</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                            Filing Prep
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        Apr 1, 2026
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Amina Khalid</p>
                                        <p className="text-xs text-gray-500">amina.khalid@example.com</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">F-1 Student Visa</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                            Approved
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                        —
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Recent Activity</h2>
                    </div>
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900"><strong>David Miller</strong> uploaded <span className="font-semibold">I-130_Receipt.pdf</span> to Maria Rodriguez's case.</p>
                                    <span className="text-xs font-semibold text-gray-400 mt-1 block">15 min ago</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900"><strong>System</strong> auto-approved payment for <strong>H-1B Processing Fee</strong>.</p>
                                    <span className="text-xs font-semibold text-gray-400 mt-1 block">2 hours ago</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#E3755D] flex items-center justify-center shrink-0 mt-0.5">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900"><strong>Sarah Jones</strong> created a new client profile for <strong>Wei Chen</strong>.</p>
                                    <span className="text-xs font-semibold text-gray-400 mt-1 block">5 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
