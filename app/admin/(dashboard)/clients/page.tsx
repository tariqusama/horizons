import React from 'react';
import Link from 'next/link';

export default function AdminClientsPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Client Directory</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage client profiles, contact information, and account access.</p>
                </div>
                <div className="flex space-x-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search clients..." 
                            className="w-[250px] bg-white border border-gray-200 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 shadow-sm font-medium text-gray-900"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>
                    <Link href="/admin/clients/new" className="bg-[#111827] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center space-x-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Add Client</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: "Maria Rodriguez", email: "maria.r@example.com", phone: "+1 (415) 555-0198", status: "Active", initials: "MR", cases: 2 },
                    { name: "Wei Chen", email: "w.chen@example.com", phone: "+1 (650) 555-8732", status: "Active", initials: "WC", cases: 1 },
                    { name: "Amina Khalid", email: "amina.khalid@example.com", phone: "+1 (800) 795-7153", status: "Active", initials: "AK", cases: 1 },
                    { name: "John Smith", email: "jsmith@example.com", phone: "+1 (212) 555-1029", status: "Inactive", initials: "JS", cases: 0 },
                    { name: "Elena Volkov", email: "elena.v@example.com", phone: "+1 (312) 555-9482", status: "Active", initials: "EV", cases: 3 },
                    { name: "Ahmed Hassan", email: "ahmed.h@example.com", phone: "+1 (408) 555-2233", status: "New", initials: "AH", cases: 1 },
                ].map((client, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1B3A64] to-[#3B66A5] text-white flex items-center justify-center font-bold text-lg shadow-inner">
                                {client.initials}
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                client.status === 'Active' ? 'bg-green-100 text-green-800' :
                                client.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {client.status}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#E3755D] transition-colors">{client.name}</h3>
                        <div className="mt-4 space-y-2 flex-1">
                            <div className="flex items-center text-sm text-gray-600 font-medium">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                {client.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 font-medium">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                {client.phone}
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{client.cases} Active {client.cases === 1 ? 'Case' : 'Cases'}</span>
                            <Link href="/admin/clients/profile" className="text-sm font-bold text-[#E3755D] hover:text-[#C8634D] transition-colors">View Profile</Link>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex justify-center">
                <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
                    Load More Clients
                </button>
            </div>
        </div>
    );
}
