'use client';

import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead, Notification } from '@/lib/api/notifications';
import styles from './notifications.module.css';

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
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>Notifications</h1>
                    <p>All of your recent alerts and account updates in one place.</p>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={fetchNotifications} className={styles.refreshBtn}>Refresh</button>
                    <button disabled={markingAll} onClick={handleMarkAll} className={styles.newTicketBtn}>
                        {markingAll ? 'Marking...' : 'Mark all as read'}
                    </button>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Alerts</span>
                        <svg className={`${styles.statIcon} ${styles.blue}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                    </div>
                    <div className={styles.statValue}>{loading ? '–' : notifications.length}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Unread</span>
                        <svg className={`${styles.statIcon} ${styles.orange}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className={styles.statValue}>{loading ? '–' : unreadCount}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Recent</span>
                        <svg className={`${styles.statIcon} ${styles.green}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className={styles.statValue}>{loading ? '–' : notifications.slice(0, 3).length}</div>
                </div>
            </div>

            <div className={styles.ticketsSection}>
                <h2 className={styles.sectionTitle}>Your Notifications</h2>
                <p className={styles.sectionDesc}>Review alerts, updates, and status changes for your account.</p>

                <div className={styles.notificationList}>
                    {loading && <div className={styles.emptyState}>Loading notifications…</div>}
                    {!loading && notifications.length === 0 && (
                        <div className={styles.emptyState}>
                            <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <div className={styles.emptyText}>No notifications at this time</div>
                        </div>
                    )}
                    {!loading && notifications.map((notification) => {
                        const parsed = getNotificationData(notification.data);
                        const isUnread = !notification.read_at;
                        return (
                            <div key={notification.id} className={`${styles.notificationCard} ${isUnread ? styles.notificationUnread : ''}`}>
                                <div className={styles.notificationMain}>
                                    <p className={styles.notificationTitle}>{parsed.title || 'Update'}</p>
                                    <p className={styles.notificationText}>{parsed.text || 'No details available.'}</p>
                                </div>
                                <div className={styles.notificationMeta}>
                                    <span className={styles.notificationTime}>{formatDate(notification.created_at)}</span>
                                    <div className={styles.notificationActions}>
                                        <button onClick={() => handleMark(notification.id)} disabled={loadingIds.includes(notification.id)} className={styles.actionBtn}>
                                            {loadingIds.includes(notification.id) ? '...' : 'Mark read'}
                                        </button>
                                        <button onClick={() => handleOpenInfo(notification)} className={styles.actionBtn}>Info</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {infoOpen && (
                <div className={styles.infoOverlay} onClick={closeInfo}>
                    <div className={styles.infoModal} onClick={(e) => e.stopPropagation()}>
                        <h3>Notification Details</h3>
                        <pre>{JSON.stringify(infoOpen, null, 2)}</pre>
                        <div className={styles.infoCloseRow}>
                            <button onClick={closeInfo} className={styles.newTicketBtn}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
