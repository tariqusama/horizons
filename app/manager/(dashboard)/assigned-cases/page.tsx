import React from 'react';
import Link from 'next/link';

export default function AssignedCasesPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Assigned Cases</h1>
                    <p className="text-gray-500 mt-2 font-medium">All cases currently assigned to you for review and processing.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                    <div className="flex space-x-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                            Filter by Status
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                            Filter by Case Type
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">#CASE-101</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">Maria Rodriguez</p>
                                    <p className="text-xs text-gray-500">maria.r@example.com</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-700">I-90 Replacement</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">Oct 24, 2026</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                        Pending Review
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href="/manager/assigned-cases/101" className="inline-flex items-center space-x-1 text-white bg-[#E3755D] hover:bg-[#C8634D] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                        <span>Review Case</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">#CASE-102</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">Ahmed Hassan</p>
                                    <p className="text-xs text-gray-500">ahmed.h@example.com</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-700">N-400 Naturalization</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">Oct 23, 2026</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                        Awaiting Documents
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href="/manager/assigned-cases/102" className="inline-flex items-center space-x-1 text-white bg-[#E3755D] hover:bg-[#C8634D] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                        <span>Review Case</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">#CASE-103</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">Chen Wei</p>
                                    <p className="text-xs text-gray-500">chen.w@example.com</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-700">I-130 Petition</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">Oct 22, 2026</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                        Pending Review
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href="/manager/assigned-cases/103" className="inline-flex items-center space-x-1 text-white bg-[#E3755D] hover:bg-[#C8634D] px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                        <span>Review Case</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors opacity-75">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">#CASE-098</span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">David Miller</p>
                                    <p className="text-xs text-gray-500">david.m@example.com</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-gray-700">I-485 Adjustment</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">Oct 19, 2026</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                        Processed
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href="/manager/assigned-cases/098" className="inline-flex items-center space-x-1 text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                        <span>View Detail</span>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
