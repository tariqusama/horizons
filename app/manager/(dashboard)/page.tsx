import React from 'react';
import Link from 'next/link';

export default function ManagerDashboardPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Manager Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back, Sarah! Here is the status of your assigned cases.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Total Assigned</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">142</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Pending Review</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">28</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">+12 this week</span>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Processed Cases</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">114</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-[#E3755D] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Avg Processing Time</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">2.4 days</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority Cases */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Priority Assigned Cases</h2>
                        <Link href="/manager/assigned-cases" className="text-sm text-[#E3755D] font-semibold hover:underline">View All Assigned</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Maria Rodriguez</p>
                                        <p className="text-xs text-gray-500">I-90 Replacement</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">Green Card</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                            Pending Review
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href="/manager/assigned-cases/101" className="text-[#E3755D] font-semibold text-sm hover:underline">
                                            Review Case
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Ahmed Hassan</p>
                                        <p className="text-xs text-gray-500">N-400 Naturalization</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">Citizenship</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                            Awaiting Documents
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href="/manager/assigned-cases/102" className="text-[#E3755D] font-semibold text-sm hover:underline">
                                            Review Case
                                        </Link>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">Chen Wei</p>
                                        <p className="text-xs text-gray-500">I-130 Petition</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-700">Family</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                            Pending Review
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href="/manager/assigned-cases/103" className="text-[#E3755D] font-semibold text-sm hover:underline">
                                            Review Case
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Recent Updates</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">New document uploaded</p>
                                <p className="text-xs text-gray-500 mt-1">Maria Rodriguez uploaded 'Passport_Copy.pdf' for Case #101.</p>
                                <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-wider">2 HOURS AGO</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-1">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Case Approved</p>
                                <p className="text-xs text-gray-500 mt-1">You processed and approved Case #98 for final submission.</p>
                                <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-wider">YESTERDAY</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
