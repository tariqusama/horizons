'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getManagerAssignedCases, Application } from '@/lib/api/cases';
import { getNotifications, Notification } from '@/lib/api/notifications';

export default function ManagerDashboardPage() {
    const { user } = useAuth();
    const [cases, setCases] = useState<Application[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const loadData = async () => {
            try {
                const [assignedCases, allNotifs] = await Promise.all([
                    getManagerAssignedCases(),
                    getNotifications()
                ]);
                setCases(assignedCases);
                setNotifications(allNotifs.slice(0, 5)); // show recent 5
            } catch (err) {
                console.error('Failed to fetch manager dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto w-full h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3755D]"></div>
            </div>
        );
    }

    const totalAssigned = cases.length;
    const pendingReview = cases.filter(c => c.status === 'Pending' || c.status === 'Active' || c.status === 'Under Review').length;
    const processedCases = cases.filter(c => c.status === 'Approved' || c.status === 'Completed').length;

    // Use top 5 recent cases
    const recentCases = cases.slice(0, 5);

    return (
        <div className="max-w-[1200px] mx-auto w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Manager Dashboard</h1>
                    <p className="text-gray-500 mt-2 font-medium">Welcome back, {user?.name?.split(' ')[0] || 'Manager'}! Here is the status of your assigned cases.</p>
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
                    <p className="text-3xl font-black text-gray-900 mt-1">{totalAssigned}</p>
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
                    <p className="text-3xl font-black text-gray-900 mt-1">{pendingReview}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        {processedCases > 0 && <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">Live DB count</span>}
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">Processed Cases</p>
                    <p className="text-3xl font-black text-gray-900 mt-1">{processedCases}</p>
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
                    <p className="text-3xl font-black text-gray-900 mt-1">~2.4 days</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Priority Cases */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Your Priority Cases</h2>
                        <Link href="/manager/assigned-cases" className="text-sm text-[#E3755D] font-semibold hover:underline">View All Assigned</Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        {recentCases.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">You do not have any assigned cases yet.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case Details</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentCases.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900 text-sm">{c.user?.name || 'Unknown Client'}</p>
                                                <p className="text-xs text-gray-500">{c.user?.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-700 text-sm">{c.title}</p>
                                                <p className="text-xs text-gray-500">{c.subtitle}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            c.status === 'Denied' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/manager/assigned-cases/${c.id}`} className="text-[#E3755D] font-semibold text-sm hover:underline">
                                                    Review Case
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-lg">Recent Updates</h2>
                    </div>
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-gray-500 text-sm text-center">No recent notifications.</div>
                        ) : (
                            notifications.map(n => {
                                const IconComp = (p: any) => (
                                    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: n.data.icon }} />
                                );
                                return (
                                    <div key={n.id} className="flex gap-4">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1"
                                            style={{ backgroundColor: n.data.bg || '#F3F4F6', color: n.data.color || '#374151' }}
                                        >
                                            {n.data.icon ? <IconComp width={16} height={16} /> : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{n.data.title || 'Notification'}</p>
                                            <p className="text-xs text-gray-500 mt-1">{n.data.text || 'You have a new update.'}</p>
                                            <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-wider">
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
