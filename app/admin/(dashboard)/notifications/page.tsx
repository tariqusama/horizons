"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getNotifications, markAsRead, Notification } from '../../../../lib/api/notifications';

function formatDate(dt: string) {
    try {
        const d = new Date(dt);
        return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) { return dt; }
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [infoOpen, setInfoOpen] = useState<Notification | null>(null);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [markingAll, setMarkingAll] = useState(false);

    const fetch = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    const unreadCount = notifications.filter(n => !n.read_at).length;
    const warningsCount = notifications.filter(n => {
        try { const d = typeof n.data === 'string' ? JSON.parse(n.data) : n.data; return (d?.type || '').toLowerCase().includes('warning'); } catch { return false; }
    }).length;
    const paymentCount = notifications.filter(n => {
        try { const d = typeof n.data === 'string' ? JSON.parse(n.data) : n.data; return (d?.type || '').toLowerCase().includes('payment'); } catch { return false; }
    }).length;
    const pdfCount = notifications.filter(n => {
        try { const d = typeof n.data === 'string' ? JSON.parse(n.data) : n.data; return (d?.type || '').toLowerCase().includes('pdf'); } catch { return false; }
    }).length;

    const handleMarkAll = async () => {
        setMarkingAll(true);
        const prev = notifications;
        // optimistic: mark all locally
        setNotifications(prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        try {
            await markAsRead();
        } catch (err) {
            console.error('Mark all failed', err);
            // revert
            setNotifications(prev);
        } finally {
            setMarkingAll(false);
            fetch();
        }
    };

    const handleMark = async (id?: string) => {
        if (!id) return;
        // prevent double
        if (loadingIds.includes(id)) return;
        setLoadingIds(prev => [...prev, id]);
        const prev = notifications;
        // optimistic
        setNotifications(prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        try {
            await markAsRead(id);
        } catch (err) {
            console.error('Mark failed', err);
            // revert
            setNotifications(prev);
        } finally {
            setLoadingIds(prev => prev.filter(x => x !== id));
            fetch();
        }
    };

    const handleViewCase = async (caseId?: string | number, id?: string) => {
        if (!caseId) return;
        try {
            if (id) await markAsRead(id);
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
        router.push(`/admin/cases/${caseId}`);
    };

    const handleInfo = (n: Notification) => {
        setInfoOpen(n);
    };

    const closeInfo = () => setInfoOpen(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111c44]">System Notification Center</h1>
                    <p className="text-sm text-[#6b7280]">Automated alerts and system events</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetch} className="px-3 py-2 rounded-md bg-white border text-sm">Refresh</button>
                    <button onClick={handleMarkAll} className="px-3 py-2 rounded-md bg-[#E3755D] text-white text-sm">Mark all as read</button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                    <div>
                        <div className="text-sm text-[#8A8F98]">Unread Notifications</div>
                        <div className="text-2xl font-bold text-[#E3755D]">{unreadCount}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#E3755D]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E3755D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                    </div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                    <div>
                        <div className="text-sm text-[#8A8F98]">Warnings</div>
                        <div className="text-2xl font-bold text-[#E3A21A]">{warningsCount}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#fff9ed] flex items-center justify-center text-[#E3A21A]">⚠️</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                    <div>
                        <div className="text-sm text-[#8A8F98]">Payment Issues</div>
                        <div className="text-2xl font-bold text-[#10B981]">{paymentCount}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#ecffef] flex items-center justify-center text-[#10B981]">💲</div>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border flex items-center justify-between">
                    <div>
                        <div className="text-sm text-[#8A8F98]">PDF Errors</div>
                        <div className="text-2xl font-bold text-[#3B82F6]">{pdfCount}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#eef6ff] flex items-center justify-center text-[#3B82F6]">📄</div>
                </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
                <h2 className="font-semibold text-lg text-[#111c44] mb-2">Recent Alerts</h2>
                <p className="text-sm text-[#6b7280] mb-4">System generated alerts and notifications ({notifications.length})</p>

                <div className="space-y-3">
                    {loading && <div className="text-sm text-[#6b7280]">Loading...</div>}
                    {!loading && notifications.map((n) => {
                        const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                        const isUnread = !n.read_at;
                        const caseId = data?.case_id || data?.notifiable_id;
                        return (
                            <div key={n.id} className={`flex items-center justify-between p-3 rounded-md border ${isUnread ? 'bg-[#fbfdff]' : 'bg-white'}`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isUnread ? 'bg-[#fff4f0] text-[#F47A3C]' : 'bg-[#f3f4f6] text-[#9aa2ac]'}`}>•</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-sm ${isUnread ? 'font-semibold text-[#101F38]' : 'font-medium text-[#101F38]'}`}>{data?.title || 'New alert'}</div>
                                            <div className="text-xs text-[#9aa2ac]">{formatDate(n.created_at)}</div>
                                        </div>
                                        <div className="text-sm text-[#6b7280] mt-1">{data?.email || data?.meta || ''} <span className="px-2 py-0.5 bg-[#eef5ff] text-[#3D7BC9] rounded-full text-xs ml-2">Case</span></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleViewCase(caseId, n.id)} className="text-xs px-3 py-1.5 bg-white border rounded-md">View case</button>
                                    <button disabled={loadingIds.includes(n.id)} onClick={() => handleMark(n.id)} className="text-xs px-3 py-1.5 bg-white border rounded-md">
                                        {loadingIds.includes(n.id) ? (
                                            <svg className="animate-spin w-3 h-3 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                                        ) : 'Mark read'}
                                    </button>
                                    <button onClick={() => handleInfo(n)} className="text-xs px-2 py-1 bg-white border rounded-md">Info</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {infoOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={closeInfo}>
                    <div className="bg-white rounded-lg p-6 w-[600px] max-w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold mb-2">Notification Details</h3>
                        <pre className="text-xs text-[#334155] max-h-[60vh] overflow-auto bg-[#f8fafc] p-3 rounded">{JSON.stringify(infoOpen, null, 2)}</pre>
                        <div className="mt-4 text-right">
                            <button onClick={closeInfo} className="px-3 py-2 bg-[#E3755D] text-white rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
