import React from 'react';
import Link from 'next/link';

export default async function CaseReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Header / Breadcrumbs */}
            <div className="mb-6 flex items-center space-x-3 text-sm font-medium text-gray-500">
                <Link href="/manager/assigned-cases" className="hover:text-gray-900 transition-colors">Assigned Cases</Link>
                <span>/</span>
                <span className="text-gray-900">Case #{id}</span>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                        Review Case: #{id}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 tracking-wide uppercase">
                            Pending Review
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Applicant: Maria Rodriguez | I-90 Replacement</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Details & Documents */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Case Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Applicant Information</h2>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-gray-900">Maria Rodriguez</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                <p className="text-sm font-semibold text-gray-900">maria.r@example.com</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                                <p className="text-sm font-semibold text-gray-900">Jan 14, 1985</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">A-Number</p>
                                <p className="text-sm font-semibold text-gray-900">A123456789</p>
                            </div>
                        </div>
                    </div>

                    {/* Submitted Documents */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Submitted Documents</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">I-90 Application Form</p>
                                        <p className="text-xs text-gray-500">Filled digitally • Oct 24, 2026</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-[#E3755D] hover:underline">View</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Copy of Expired Green Card</p>
                                        <p className="text-xs text-gray-500">Image/JPG • 2.4 MB • Oct 24, 2026</p>
                                    </div>
                                </div>
                                <button className="text-sm font-bold text-[#E3755D] hover:underline">View</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Processing Workflow */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-[100px]">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Review & Process</h2>
                        
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Manager Notes / Feedback</label>
                            <textarea 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#E3755D]/50 focus:border-[#E3755D] min-h-[120px] resize-y"
                                placeholder="Add notes here. If requesting revisions, detail exactly what the client needs to fix..."
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Approve & Process Further
                            </button>
                            
                            <button className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12h4l2-9 5 18 3-10h4"></path>
                                </svg>
                                Request Revisions
                            </button>

                            <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-600 px-6 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                Reject Case
                            </button>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                Processing a case will notify the client and update the case status across the platform.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
