"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Sidebar from "./Sidebar";
import styles from "./dashboardLayout.module.css";
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markAsRead, Notification } from '@/lib/api/notifications';

export default function DashboardClient({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchLayoutData = async () => {
            try {
                if (user) {
                    const data = await getNotifications();
                    setNotifications(data);
                    setUnreadCount(data.filter(n => !n.read_at).length);
                }
            } catch (err) {
                console.error('Failed to load notifications', err);
            }
        };
        fetchLayoutData();
    }, [user]);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role === 'admin') {
                router.push('/admin');
            } else if (user.role === 'manager') {
                router.push('/manager');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className={styles.layoutContainer}>
            {/* Sidebar Overlay */}
            <div
                className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.open : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={styles.mainWrapper}>
                <header className={styles.topbar}>
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Search..." className={styles.searchInput} />
                    </div>

                    <div className={styles.topbarActions}>
                        <button className={styles.actionIconBtn}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)} 
                                className={`${styles.actionIconBtn} ${styles.blue} relative`}
                            >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 min-w-[1rem] rounded-full bg-red-500 text-[9px] text-white font-bold px-1 transform translate-x-1/4 -translate-y-1/4">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                                        <h3 className="font-bold text-[#1B3A64] text-sm">Notifications</h3>
                                        <button onClick={async () => { await markAsRead(); const data = await getNotifications(); setNotifications(data); setUnreadCount(data.filter(n => !n.read_at).length); }} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Mark all as read</button>
                                    </div>
                                    <div className="max-h-[320px] overflow-y-auto">
                                        {notifications.length === 0 && (
                                            <div className="p-6 text-center text-sm text-[#5B6472]">No notifications</div>
                                        )}
                                        {notifications.map((n) => {
                                            const parsedData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                                            const isUnread = !n.read_at;
                                            return (
                                                <div key={n.id} className={`p-4 transition-colors flex gap-3 items-start border-b border-gray-50 ${isUnread ? 'bg-[#FDFCFB]' : 'bg-white hover:bg-[#F9F8F6]'}`}>
                                                    <div className="mt-1 shrink-0">
                                                        {parsedData?.type === 'message' && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#E3755D" : "#8A8F98"} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                        )}
                                                        {parsedData?.type === 'alert' && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#E3755D" : "#8A8F98"} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                        )}
                                                        {parsedData?.type === 'system' && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#101F38" : "#8A8F98"} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                                        )}
                                                        {parsedData?.type === 'status' && (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#2F8A5F" : "#8A8F98"} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                        )}
                                                        {!parsedData?.type && (
                                                            <div className="w-2 h-2 mt-1 rounded-full shrink-0" style={{ background: isUnread ? '#E3755D' : 'transparent' }}></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <p className={`text-sm ${isUnread ? 'font-black text-[#101F38]' : 'font-bold text-[#101F38]'}`}>{parsedData?.title || 'Notification'}</p>
                                                            <span className="text-[10px] font-semibold text-[#8A8F98] whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</span>
                                                        </div>
                                                        <p className={`text-sm ${isUnread ? 'text-[#101F38] font-medium' : 'text-[#5B6472]'}`}>{parsedData?.text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="px-5 py-3 border-t border-gray-100 text-center bg-[#F8F9FA]">
                                        <Link href="/dashboard/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#E3755D] hover:text-[#C8634D]">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link href="/dashboard/profile" className={styles.userProfile}>
                            <div className={styles.userAvatar}>
                                {user?.profile_picture_url ? (
                                    <img src={user.profile_picture_url} alt={user?.name || 'Profile avatar'} className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>
                            <span className={styles.userName}>{user.name}</span>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" className="text-gray-400">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </header>

                <div className={styles.contentArea}>
                    {children}
                </div>
            </main>
        </div>
    );
}
