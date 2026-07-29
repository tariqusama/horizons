'use client';
import React, { useState, useEffect } from 'react';
import { getControlCenterData } from '../../../../lib/api/analytics';

const Icon = {
    activity: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" /></svg>,
    alert: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335" /><path d="m9 11 3 3L22 4" /></svg>,
    file: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="m9 15 2 2 4-4" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>,
    eye: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>,
};

const TABS = ['AI Reviews', 'Documents', 'Risk Assessments', 'Trends'] as const;
type Tab = typeof TABS[number];

interface ReviewType {
    name: string;
    count: number;
    passed: number;
    flagged: number;
    failed: number;
}

interface FlaggedReview {
    id: string;
    type: string;
    status: 'flagged' | 'failed';
    findings: number;
    confidence: number;
    timestamp: string;
    caseId: string;
}

export default function AdminControlCenterPage() {
    const [activeTab, setActiveTab] = useState<Tab>('AI Reviews');
    const [reviewTypes, setReviewTypes] = useState<ReviewType[]>([]);
    const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getControlCenterData();
                setReviewTypes(data.reviewTypes || []);
                setFlaggedReviews(data.flaggedReviews || []);
                setStats(data.stats || {});
            } catch (err) {
                console.error('Failed to load control center data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const successRate = (passed: number, total: number) => total === 0 ? 0 : Math.round((passed / total) * 100 * 10) / 10;

    if (loading) {
        return (
            <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
                <div className="flex justify-center items-center h-64 text-slate-500">
                    Loading Control Center...
                </div>
            </main>
        );
    }

    const s = stats || {};
    const aiRate = s.aiReviews?.count ? successRate(s.aiReviews.passed, s.aiReviews.count) : 0;
    const docRate = s.docVerification?.count ? successRate(s.docVerification.count - s.docVerification.pending - s.docVerification.missing, s.docVerification.count) : 0;

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="mb-6 px-1">
                <h1 className="text-2xl font-bold text-slate-900">Quality Control</h1>
                <p className="text-sm text-slate-600 mt-1">AI reviews, document verification, and risk assessments</p>
            </div>

            <div className="space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* AI Reviews Card */}
                    <div className="rounded-lg relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-slate-50 to-cyan-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">AI Reviews</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm">
                                <Icon.activity width={16} height={16} className="text-blue-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{s.aiReviews?.count || 0}</div>
                            <p className="text-xs text-slate-600 mt-1">{aiRate.toFixed(1)}% pass rate</p>
                            <div className="mt-3 space-y-1">
                                <div className="relative w-full overflow-hidden rounded-full bg-slate-200 h-2">
                                    <div className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${aiRate}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>{s.aiReviews?.passed || 0} passed</span>
                                    <span>{s.aiReviews?.flagged || 0} flagged</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flagged Items Card */}
                    <div className="rounded-lg relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 via-slate-50 to-yellow-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Flagged Items</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm">
                                <Icon.alert width={16} height={16} className="text-orange-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative">
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">{s.flaggedItems?.count || 0}</div>
                            <p className="text-xs text-slate-600 mt-1">Need review</p>
                            <div className="mt-3 flex gap-2">
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">{s.flaggedItems?.flagged || 0} flagged</div>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs bg-red-500/10 text-red-600 border-red-500/20">{s.flaggedItems?.failed || 0} failed</div>
                            </div>
                        </div>
                    </div>

                    {/* Doc Verification Card */}
                    <div className="rounded-lg relative overflow-hidden border-0 bg-gradient-to-br from-green-500/10 via-slate-50 to-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Doc Verification</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm">
                                <Icon.file width={16} height={16} className="text-green-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{s.docVerification?.count || 0}</div>
                            <p className="text-xs text-slate-600 mt-1">{docRate.toFixed(1)}% verified</p>
                            <div className="mt-3 space-y-1">
                                <div className="relative w-full overflow-hidden rounded-full bg-slate-200 h-2">
                                    <div className="h-full w-full flex-1 bg-gradient-to-r from-green-500 to-emerald-500 transition-all" style={{ width: `${docRate}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>{s.docVerification?.pending || 0} pending</span>
                                    <span>{s.docVerification?.missing || 0} missing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Risks Card */}
                    <div className="rounded-lg relative overflow-hidden border-0 bg-gradient-to-br from-red-500/10 via-slate-50 to-rose-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-rose-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="p-6 relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium text-slate-700">Active Risks</h3>
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-sm">
                                <Icon.shield width={16} height={16} className="text-red-500" />
                            </div>
                        </div>
                        <div className="p-6 pt-0 relative">
                            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{s.activeRisks?.count || 0}</div>
                            <p className="text-xs text-slate-600 mt-1">{s.activeRisks?.critical || 0} critical</p>
                            <div className="mt-3 flex gap-2">
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs bg-red-500/10 text-red-600 border-red-500/20">{s.activeRisks?.critical || 0} critical</div>
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold text-xs bg-orange-500/10 text-orange-600 border-orange-500/20">{s.activeRisks?.high || 0} high</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div dir="ltr" data-orientation="horizontal" className="space-y-6">
                    <div role="tablist" aria-orientation="horizontal" className="items-center justify-center text-slate-500 grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 bg-slate-100/30 p-1 rounded-xl" tabIndex={0}>
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg ${activeTab === tab ? 'bg-white text-slate-900 shadow-md' : 'text-slate-600'}`}
                                tabIndex={-1}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* AI Reviews Tab */}
                    {activeTab === 'AI Reviews' && (
                        <div className="space-y-6">
                            {/* Reviews by Type */}
                            <div className="rounded-lg border-0 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="text-2xl font-semibold flex items-center gap-2"><Icon.activity width={20} height={20} className="text-blue-500" />Reviews by Type</h3>
                                    <p className="text-sm text-slate-600">AI review coverage and results</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-6">
                                        {reviewTypes.map((review, idx) => {
                                            const rate = successRate(review.passed, review.count);
                                            return (
                                                <div key={idx} className="relative p-4 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-100/20 border border-slate-200/50 hover:border-slate-300 transition-all duration-300 hover:shadow-lg animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="font-semibold capitalize text-lg text-slate-900">{review.name}</span>
                                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-slate-500/10 text-slate-700 border-slate-500/20">{review.count} reviews</div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
                                                            <Icon.check width={16} height={16} className="text-green-500 shrink-0" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-slate-600">Passed</span>
                                                                <span className="font-bold text-green-600">{review.passed}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10">
                                                            <Icon.alert width={16} height={16} className="text-orange-500 shrink-0" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-slate-600">Flagged</span>
                                                                <span className="font-bold text-orange-600">{review.flagged}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                                                            <Icon.alert width={16} height={16} className="text-red-500 shrink-0" />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-slate-600">Failed</span>
                                                                <span className="font-bold text-red-600">{review.failed}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-600">Success Rate</span>
                                                            <span className="font-semibold">{rate.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="relative h-3 rounded-full bg-slate-300 overflow-hidden">
                                                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all" style={{ width: `${rate}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Flagged Reviews */}
                            <div className="rounded-lg border-0 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="text-2xl font-semibold flex items-center gap-2"><Icon.alert width={20} height={20} className="text-orange-500" />Recent Flagged Reviews</h3>
                                    <p className="text-sm text-slate-600">Items requiring manual review</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-3">
                                        {flaggedReviews.length === 0 ? (
                                            <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed">
                                                <p className="text-slate-500 font-medium">No flagged reviews currently.</p>
                                                <p className="text-xs text-slate-400 mt-1">Escalated or rejected cases will appear here.</p>
                                            </div>
                                        ) : (
                                            flaggedReviews.map((review, idx) => (
                                                <div key={idx} className="relative overflow-hidden rounded-xl p-4 border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100/20 hover:shadow-[0_8px_20px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative flex items-start justify-between gap-4">
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${review.status === 'flagged' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                                                                {review.status}
                                                            </div>
                                                            <span className="font-semibold capitalize text-slate-900">{review.type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/50">
                                                                <Icon.alert width={16} height={16} className="text-orange-500" />
                                                                <span className="font-medium">{review.findings}</span>
                                                                <span className="text-slate-600">findings</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/50">
                                                                <Icon.activity width={16} height={16} className="text-blue-500" />
                                                                <span className="font-medium">{review.confidence}%</span>
                                                                <span className="text-slate-600">confidence</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                                            {review.timestamp}
                                                        </p>
                                                    </div>
                                                    <a href={`/manager/assigned-cases/${review.caseId}`} className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-300 bg-white h-9 rounded-md px-3 shrink-0 hover:bg-blue-500 hover:text-white hover:border-blue-500">
                                                        <Icon.eye width={16} height={16} />
                                                        Review
                                                    </a>
                                                </div>
                                            </div>
                                        )))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other tabs placeholder */}
                    {activeTab !== 'AI Reviews' && (
                        <div className="rounded-lg border-0 bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
                            <p className="text-slate-600">Content for {activeTab} tab coming soon</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
