'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getNotifications, markAsRead, Notification } from '@/lib/api/notifications';

function formatDate(dt: string) {
    try {
        const d = new Date(dt);
        return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
        return dt;
    }
}

export default function ManagerNotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    const handleMarkAllRead = async () => {
        setMarkingAll(true);
        const previous = notifications;
        setNotifications(previous.map((n) => ({ ...n, read_at: new Date().toISOString() })));
        try {
            await markAsRead();
            await fetchNotifications();
        } catch (err) {
            console.error('Failed to mark all as read', err);
            setNotifications(previous);
        } finally {
            setMarkingAll(false);
        }
    };

    const handleMarkRead = async (id: string) => {
        if (loadingIds.includes(id)) return;
        setLoadingIds((prev) => [...prev, id]);
        const previous = notifications;
        setNotifications(previous.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
        try {
            await markAsRead(id);
            await fetchNotifications();
        } catch (err) {
            console.error('Failed to mark notification read', err);
            setNotifications(previous);
        } finally {
            setLoadingIds((prev) => prev.filter((item) => item !== id));
        }
    };

    const handleViewNotification = async (notification: Notification) => {
        const data = typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data;
        if (notification.id) {
            await markAsRead(notification.id);
        }
        if (data?.case_id) {
            router.push(`/manager/assigned-cases/${data.case_id}`);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Manager Notifications</h1>
                    <p className="text-gray-500 mt-2">All your system and case notifications in one place.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={fetchNotifications} className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#E3755D] hover:text-[#E3755D] transition">
                        Refresh
                    </button>
                    <button onClick={handleMarkAllRead} disabled={markingAll || unreadCount === 0} className="rounded-full bg-[#E3755D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c05143] disabled:opacity-60 transition">
                        {markingAll ? 'Marking...' : 'Mark all as read'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="space-y-4">
                        <div className="rounded-3xl bg-[#F8F9FA] p-5">
                            <p className="text-sm text-gray-500">Unread</p>
                            <p className="text-4xl font-black text-gray-900 mt-2">{unreadCount}</p>
                        </div>
                        <div className="rounded-3xl bg-[#EFF6FF] p-5">
                            <p className="text-sm text-gray-500">Total notifications</p>
                            <p className="text-4xl font-black text-gray-900 mt-2">{notifications.length}</p>
                        </div>
                    </div>
                </aside>

                <section className="space-y-4">
                    {loading ? (
                        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">No notifications yet.</div>
                    ) : (
                        notifications.map((notification) => {
                            const data = typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data;
                            const isUnread = !notification.read_at;
                            const isLoading = loadingIds.includes(notification.id);
                            return (
                                <div key={notification.id} className={`rounded-3xl border p-6 shadow-sm ${isUnread ? 'bg-[#FFFBF5] border-[#F1C6AF]' : 'bg-white border-gray-200'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{data?.title || 'Notification'}</p>
                                            <p className="mt-2 text-sm text-gray-600">{data?.text || 'No details available.'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{formatDate(notification.created_at)}</p>
                                            {isUnread && <span className="mt-2 inline-flex rounded-full bg-[#E3755D] px-2 py-1 text-[11px] font-semibold text-white">Unread</span>}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-3 items-center">
                                        {data?.case_id && (
                                            <button onClick={() => handleViewNotification(notification)} className="rounded-full border border-[#E3755D] px-4 py-2 text-sm font-semibold text-[#E3755D] hover:bg-[#FEF2F1] transition">
                                                View case
                                            </button>
                                        )}
                                        <button disabled={isLoading || !isUnread} onClick={() => handleMarkRead(notification.id)} className="rounded-full bg-white border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                                            {isLoading ? 'Updating…' : 'Mark read'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </section>
            </div>
        </div>
    );
}
