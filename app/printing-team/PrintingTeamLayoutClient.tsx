'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markAsRead, clearAllNotifications, Notification } from '@/lib/api/notifications';

const navItems = [
    { label: 'Dashboard', href: '/printing-team', bg: '#FDECE2', fg: '#F97316' },
    { label: 'Print Queue', href: '/printing-team/print-queue', bg: '#ECFDF5', fg: '#16A34A' },
    { label: 'Shipment Status', href: '/printing-team/shipment-status', bg: '#EFF6FF', fg: '#2563EB' },
    { label: 'Documents', href: '/printing-team/documents', bg: '#FEF3C7', fg: '#A16207' },
    { label: 'Notifications', href: '/printing-team/notifications', bg: '#F8FAFC', fg: '#0F766E' },
];

function SidebarContent({ pathname, logout, onLinkClick }: { pathname: string | null; logout: () => void; onLinkClick?: () => void }) {
    return (
        <>
            <div className="px-6 pt-6 pb-4 flex justify-start">
                <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="h-12 w-auto" />
            </div>

            <div className="px-6 pb-3">
                <span className="text-xs font-semibold text-slate-500 tracking-widest">PRINTING TEAM PORTAL</span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 px-3">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = item.href === '/printing-team' ? pathname === '/printing-team' : pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onLinkClick}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
                            >
                                <span
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-orange-500 text-white' : ''}`}
                                    style={!isActive ? { backgroundColor: item.bg, color: item.fg } : undefined}
                                >
                                    {item.label[0]}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-6 px-1">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-600 hover:to-orange-700 transition-all"
                    >
                        <span className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold">S</span>
                        Sign out
                    </button>
                </div>
            </div>
        </>
    );
}

export default function PrintingTeamLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            const role = (user.role || '').toString().toLowerCase();
            if (!role.includes('printing') && !role.includes('printing-team')) {
                router.push('/dashboard');
            } else {
                setAuthorized(true);
            }
        }
    }, [user, isLoading, router]);

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read_at).length);
        } catch (err) {
            console.error('Failed to load notifications', err);
        }
    };

    useEffect(() => {
        if (authorized) {
            loadNotifications();
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [authorized]);

    const toggleNotifications = async () => {
        if (!showNotifications) {
            await loadNotifications();
        }
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        setSidebarOpen(false);
        setShowNotifications(false);
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center text-slate-600">Loading printing team portal…</div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">Access denied</h1>
                    <p className="text-sm text-slate-600 mb-6">You do not have access to the printing team portal.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                        Return to dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F4F1] flex font-body p-2 sm:p-4 gap-2 sm:gap-4">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden rounded-r-3xl overflow-y-auto hide-scrollbar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    ×
                </button>
                <SidebarContent pathname={pathname} logout={logout} onLinkClick={() => setSidebarOpen(false)} />
            </div>

            <aside className="hidden lg:flex lg:flex-col fixed left-4 top-4 h-[calc(100vh-2rem)] w-72 z-40">
                <div className="h-full flex flex-col rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
                        <SidebarContent pathname={pathname} logout={logout} />
                    </div>
                </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col lg:ml-[19rem]">
                <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mb-4 bg-white rounded-3xl shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-full bg-[#F5F5F5] border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Open menu"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex-1 relative min-w-0">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <path d="M21 21l-4.35-4.35" />
                            <circle cx="10" cy="10" r="6" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search cases, documents, messages..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-orange-500 focus:bg-white transition"
                        />
                    </div>

                    <button className="hidden sm:flex w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <path d="M5 12h14M12 5h7M12 19h7" />
                        </svg>
                    </button>

                    <div className="relative shrink-0">
                        <button onClick={toggleNotifications} className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-orange-500 text-[10px] text-white font-bold px-1.5">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[320px] bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-semibold text-slate-900">Notifications</p>
                                        <button onClick={async () => { await markAsRead(); await loadNotifications(); }} className="text-xs text-slate-600 hover:text-orange-600">Mark all as read</button>
                                    </div>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-sm text-slate-600">No notifications</div>
                                    ) : (
                                        notifications.map((notification) => {
                                            const data = typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data;
                                            const isUnread = !notification.read_at;
                                            return (
                                                <div key={notification.id} className={`p-4 border-b border-slate-100 ${isUnread ? 'bg-slate-50' : 'bg-white'}`}>
                                                    <p className="text-sm font-semibold text-slate-900">{data?.title || 'Notification'}</p>
                                                    <p className="mt-2 text-sm text-slate-600">{data?.text || 'You have a new notification.'}</p>
                                                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">{new Date(notification.created_at).toLocaleDateString()}</p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-right">
                                    <button onClick={async () => { await clearAllNotifications(); await loadNotifications(); setShowNotifications(false); }} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                                        Clear notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/profile" className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold">{user?.name?.charAt(0) ?? 'P'}</div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Printing Team'}</p>
                            <p className="text-[11px] text-slate-500">Printing team portal</p>
                        </div>
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
