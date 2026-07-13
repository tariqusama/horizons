import React from 'react';

export default function AdminAnalyticsPage() {
    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-500 mt-2 font-medium">Insights into agency performance, revenue, and case processing times.</p>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button className="px-4 py-1.5 rounded-md bg-gray-100 text-gray-900 font-bold text-sm">30 Days</button>
                    <button className="px-4 py-1.5 rounded-md text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors">Quarter</button>
                    <button className="px-4 py-1.5 rounded-md text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors">Year</button>
                </div>
            </div>

            {/* Main Chart Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-gray-900 text-lg">Revenue Overview</h2>
                    <button className="text-sm font-bold text-[#E3755D] hover:text-[#C8634D] flex items-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Export Report
                    </button>
                </div>
                
                {/* Visual representation of a chart since we don't have a charting library */}
                <div className="h-[300px] w-full flex items-end justify-between space-x-2 pt-10 border-b border-gray-100 relative">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-bold text-gray-400 pb-8">
                        <span>$50k</span>
                        <span>$37.5k</span>
                        <span>$25k</span>
                        <span>$12.5k</span>
                        <span>$0</span>
                    </div>
                    
                    {/* Bars */}
                    <div className="ml-10 w-full flex items-end justify-between h-full pb-8">
                        {[40, 60, 45, 80, 65, 90, 75, 100, 85, 110, 95, 120].map((height, i) => (
                            <div key={i} className="w-[6%] relative group">
                                <div 
                                    className="w-full bg-[#1B3A64] rounded-t-sm transition-all duration-300 group-hover:bg-[#E3755D]" 
                                    style={{ height: `${height}%` }}
                                ></div>
                                {/* X-axis label */}
                                <div className="absolute -bottom-6 w-full text-center text-xs font-bold text-gray-500">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Case Distribution */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-6">Case Distribution</h2>
                    <div className="space-y-4">
                        {[
                            { name: "Family-Based Green Cards", count: 854, percent: 46, color: "bg-[#1B3A64]" },
                            { name: "Employment Visas (H-1B, L-1)", count: 532, percent: 29, color: "bg-[#E3755D]" },
                            { name: "Student Visas (F-1)", count: 285, percent: 15, color: "bg-blue-400" },
                            { name: "Naturalization & Citizenship", count: 161, percent: 10, color: "bg-green-400" },
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-gray-700">{item.name}</span>
                                    <span className="font-semibold text-gray-500">{item.count} cases</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Processing Times */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 text-lg mb-6">Average Processing Times</h2>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 border border-gray-100 font-bold text-gray-700">I-130</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Petition for Alien Relative</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">National average: 11.5 months</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#1B3A64] text-lg">9.2<span className="text-xs font-bold text-gray-400 ml-1">mo</span></p>
                                <p className="text-[10px] font-bold text-green-500">-2.3 mo vs avg</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 border border-gray-100 font-bold text-gray-700">I-485</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Adjustment of Status</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">National average: 14.5 months</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#1B3A64] text-lg">12.1<span className="text-xs font-bold text-gray-400 ml-1">mo</span></p>
                                <p className="text-[10px] font-bold text-green-500">-2.4 mo vs avg</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 border border-gray-100 font-bold text-gray-700">N-400</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Naturalization</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">National average: 8.0 months</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-[#1B3A64] text-lg">7.5<span className="text-xs font-bold text-gray-400 ml-1">mo</span></p>
                                <p className="text-[10px] font-bold text-green-500">-0.5 mo vs avg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
