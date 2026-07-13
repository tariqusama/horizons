import React from 'react';

export default function AnalyticsPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-500 mt-2 font-medium">Performance metrics and case processing statistics.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                        This Month
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export Report
                    </button>
                </div>
            </div>

            {/* High-level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Average Processing Time</p>
                    <div className="flex items-end space-x-3">
                        <p className="text-4xl font-black text-gray-900">2.4</p>
                        <p className="text-gray-500 font-medium mb-1">days</p>
                    </div>
                    <p className="text-sm text-green-600 font-bold mt-4 flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                        15% faster than last month
                    </p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Approval Rate</p>
                    <div className="flex items-end space-x-3">
                        <p className="text-4xl font-black text-gray-900">94.2</p>
                        <p className="text-gray-500 font-medium mb-1">%</p>
                    </div>
                    <p className="text-sm text-green-600 font-bold mt-4 flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                        2.1% increase
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Total Cases Handled</p>
                    <div className="flex items-end space-x-3">
                        <p className="text-4xl font-black text-gray-900">328</p>
                        <p className="text-gray-500 font-medium mb-1">cases</p>
                    </div>
                    <p className="text-sm text-gray-500 font-bold mt-4 flex items-center gap-1">
                        Consistent with average volume
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Volume Chart Placeholder */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Processing Volume</h2>
                    <div className="h-64 flex items-end justify-between space-x-2 pt-4">
                        {/* Mock Bars */}
                        <div className="w-full bg-blue-50 rounded-t-sm h-[40%] relative group">
                            <div className="absolute inset-x-0 bottom-[-24px] text-center text-xs font-bold text-gray-400">Mon</div>
                            <div className="absolute inset-0 bg-[#E3755D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="w-full bg-blue-50 rounded-t-sm h-[65%] relative group">
                            <div className="absolute inset-x-0 bottom-[-24px] text-center text-xs font-bold text-gray-400">Tue</div>
                            <div className="absolute inset-0 bg-[#E3755D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="w-full bg-blue-50 rounded-t-sm h-[85%] relative group">
                            <div className="absolute inset-x-0 bottom-[-24px] text-center text-xs font-bold text-gray-400">Wed</div>
                            <div className="absolute inset-0 bg-[#E3755D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="w-full bg-[#111827] rounded-t-sm h-[50%] relative group">
                            <div className="absolute inset-x-0 bottom-[-24px] text-center text-xs font-bold text-gray-900">Thu</div>
                        </div>
                        <div className="w-full bg-blue-50 rounded-t-sm h-[70%] relative group">
                            <div className="absolute inset-x-0 bottom-[-24px] text-center text-xs font-bold text-gray-400">Fri</div>
                            <div className="absolute inset-0 bg-[#E3755D] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </div>

                {/* Case Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Cases by Type</h2>
                    <div className="space-y-6 mt-4">
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                                <span>I-90 Replacement</span>
                                <span>45%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#E3755D] h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                                <span>N-400 Naturalization</span>
                                <span>30%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#111827] h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                                <span>I-130 Petition</span>
                                <span>15%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                                <span>Other</span>
                                <span>10%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
