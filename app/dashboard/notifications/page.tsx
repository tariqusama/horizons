'use client';

import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead, Notification } from '@/lib/api/notifications';

function formatDate(dt: string) {
    try {
        const d = new Date(dt);
        return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
        return dt;
    }
}

function getNotificationData(data: Notification['data']) {
    if (!data) return {};
    if (typeof data !== 'string') return data;

    try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return { text: data };
    }
}

export default function ClientNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [infoOpen, setInfoOpen] = useState<Notification | null>(null);

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

    const handleMarkAll = async () => {
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

    const handleMark = async (id: string) => {
        if (loadingIds.includes(id)) return;
        setLoadingIds((prev) => [...prev, id]);
        const previous = notifications;
        setNotifications(previous.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
        try {
            await markAsRead(id);
            await fetchNotifications();
        } catch (err) {
            console.error('Failed to mark notification', err);
            setNotifications(previous);
        } finally {
            setLoadingIds((prev) => prev.filter((cur) => cur !== id));
        }
    };

    const handleOpenInfo = (notification: Notification) => {
        setInfoOpen(notification);
    };

    const closeInfo = () => setInfoOpen(null);

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Notifications</h1>
                        <p className="text-slate-500 mt-1">All of your recent alerts and account updates in one place.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={fetchNotifications}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 active:brightness-110 text-white h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M23 4v6h-6"></path>
                                <path d="M1 20v-6h6"></path>
                                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
                                <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"></path>
                            </svg>
                            Refresh
                        </button>
                        <button
                            type="button"
                            disabled={markingAll}
                            onClick={handleMarkAll}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 active:brightness-110 text-white h-10 px-4 py-2 bg-orange-600 hover:bg-orange-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M9 11l3 3 6-6"></path>
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {markingAll ? 'Marking...' : 'Mark all read'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border bg-white text-slate-900 shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Total Alerts</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{loading ? '–' : notifications.length}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white text-slate-900 shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Unread</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-500">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="6" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{loading ? '–' : unreadCount}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white text-slate-900 shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Recent</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-orange-500">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{loading ? '–' : notifications.slice(0, 3).length}</div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white text-slate-900 shadow-sm">
                        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="tracking-tight text-sm font-medium">Read</h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11 3 3L22 4"></path>
                            </svg>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-2xl font-bold">{loading ? '–' : notifications.length - unreadCount}</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-white text-slate-900 shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">Your Notifications</h3>
                        <p className="text-sm text-slate-500">Review alerts, updates, and status changes for your account.</p>
                    </div>
                    <div className="p-6 pt-0">
                        {loading ? (
                            <div className="text-sm text-slate-500">Loading notifications…</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-slate-500 mx-auto mb-4">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <p className="text-slate-500 mb-4">No notifications yet</p>
                                <button
                                    type="button"
                                    onClick={fetchNotifications}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 active:brightness-110 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
                                >
                                    Refresh notifications
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notification) => {
                                    const parsed = getNotificationData(notification.data);
                                    const isUnread = !notification.read_at;
                                    return (
                                        <div key={notification.id} className={`flex items-center justify-between p-4 rounded-lg border ${isUnread ? 'bg-[#fbfdff]' : 'bg-white'}`}>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-900'}`}>{parsed.title || 'Update'}</p>
                                                <p className="text-sm text-slate-500 mt-1 truncate">{parsed.text || 'No details available.'}</p>
                                            </div>
                                            <div className="ml-4 flex flex-col items-end gap-2">
                                                <span className="text-xs text-[#9aa2ac]">{formatDate(notification.created_at)}</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleMark(notification.id)}
                                                        disabled={loadingIds.includes(notification.id)}
                                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                    >
                                                        {loadingIds.includes(notification.id) ? '...' : 'Mark read'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenInfo(notification)}
                                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Info
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {infoOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={closeInfo}>
                    <div className="bg-white rounded-2xl p-6 w-[min(90vw,600px)] max-w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold mb-4">Notification Details</h3>
                        <pre className="max-h-[60vh] overflow-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">{JSON.stringify(infoOpen, null, 2)}</pre>
                        <div className="mt-4 text-right">
                            <button
                                onClick={closeInfo}
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
