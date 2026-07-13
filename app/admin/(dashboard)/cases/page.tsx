import React from 'react';
import Link from 'next/link';

export default function AdminCasesPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Case Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Track, manage, and update all client cases in one place.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white text-gray-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                        <span>Filters</span>
                    </button>
                    <Link href="/admin/cases/new" className="bg-[#111827] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>New Case</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Filing Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { id: "CAS-8932", name: "Maria Rodriguez", type: "Marriage Green Card", status: "RFE Received", date: "Jan 15, 2026", statusColor: "yellow" },
                                { id: "CAS-8933", name: "Wei Chen", type: "H-1B Visa", status: "Filing Prep", date: "Feb 02, 2026", statusColor: "blue" },
                                { id: "CAS-8934", name: "Amina Khalid", type: "F-1 Student Visa", status: "Approved", date: "Dec 10, 2025", statusColor: "green" },
                                { id: "CAS-8935", name: "John Smith", type: "Naturalization", status: "Pending Interview", date: "Nov 22, 2025", statusColor: "purple" },
                                { id: "CAS-8936", name: "Elena Volkov", type: "O-1 Visa", status: "Under Review", date: "Mar 01, 2026", statusColor: "blue" }
                            ].map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{c.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{c.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-${c.statusColor}-100 text-${c.statusColor}-800`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {c.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/cases/${c.id}`} className="text-[#E3755D] hover:text-[#C8634D] font-bold text-sm transition-colors">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <span className="text-sm text-gray-500 font-medium">Showing 1 to 5 of 1,832 cases</span>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
