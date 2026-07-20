'use client';
import React, { useState, useEffect } from 'react';
import { getAnalyticsData } from '../../../../lib/api/analytics';

function formatCurrency(value: number) {
    return `$${value.toLocaleString()}`;
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError('');
            try {
                const analyticsData = await getAnalyticsData();
                setData(analyticsData);
            } catch (err: any) {
                console.error('Failed to load analytics', err);
                setError(err?.message || 'Unable to load analytics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const monthlyRevenue = data?.monthly_revenue ?? [];
    const maxRevenue = monthlyRevenue.length ? Math.max(...monthlyRevenue.map((m: any) => m.revenue), 1) : 100;
    const yLabels = [maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0].map(
        (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0))
    );

    const totalRevenue = monthlyRevenue.reduce((sum: number, item: any) => sum + item.revenue, 0);
    const caseDistribution = data?.case_distribution ?? [];
    const processingTimes = data?.processing_times ?? [];

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

            {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">Loading analytics data…</div>
            ) : error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-500">Total revenue (12 months)</p>
                            <p className="mt-4 text-3xl font-black text-gray-900">{formatCurrency(totalRevenue)}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-500">Services tracked</p>
                            <p className="mt-4 text-3xl font-black text-gray-900">{caseDistribution.length}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-semibold text-gray-500">Approved service averages</p>
                            <p className="mt-4 text-3xl font-black text-gray-900">{processingTimes.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg">Revenue Overview</h2>
                                <p className="text-sm text-gray-500">Monthly revenue for the past year.</p>
                            </div>
                            <button className="text-sm font-bold text-[#E3755D] hover:text-[#C8634D] flex items-center">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Export Report
                            </button>
                        </div>

                        <div className="h-[320px] w-full flex items-end justify-between space-x-2 pt-10 border-b border-gray-100 relative">
                            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs font-bold text-gray-400 pb-8">
                                {yLabels.map((l, i) => (
                                    <span key={i}>{l}</span>
                                ))}
                            </div>

                            <div className="ml-12 w-full flex items-end justify-between h-full pb-8">
                                {monthlyRevenue.map((month: any, idx: number) => {
                                    const height = (month.revenue / maxRevenue) * 100;
                                    return (
                                        <div key={idx} className="w-[6%] relative group">
                                            <div
                                                className="w-full rounded-t-sm bg-[#1B3A64] transition-all duration-300 group-hover:bg-[#E3755D]"
                                                style={{ height: `${height}%` }}
                                            />
                                            <div className="absolute -bottom-6 w-full text-center text-xs font-bold text-gray-500">
                                                {month.month}
                                            </div>
                                            <div className="pointer-events-none absolute inset-x-0 bottom-full mb-2 text-[10px] text-gray-600 opacity-0 group-hover:opacity-100">
                                                {formatCurrency(month.revenue)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 text-lg mb-6">Case Distribution</h2>
                            <div className="space-y-4">
                                {caseDistribution.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No case distribution data available.</p>
                                ) : (
                                    caseDistribution.map((item: any, idx: number) => (
                                        <div key={idx}>
                                            <div className="flex justify-between text-sm mb-1.5">
                                                <span className="font-bold text-gray-700">{item.name}</span>
                                                <span className="font-semibold text-gray-500">{item.count} cases ({item.percent}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 text-lg mb-6">Average Processing Times</h2>
                            <div className="space-y-5">
                                {processingTimes.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No approved case processing data available.</p>
                                ) : (
                                    processingTimes.map((pt: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4 border border-gray-100 font-bold text-gray-700 text-xs text-center leading-tight">Avg</div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{pt.service_name}</p>
                                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Average time to approval</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-[#1B3A64] text-lg">
                                                    {pt.avg_months}
                                                    <span className="text-xs font-bold text-gray-400 ml-1">mo</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
