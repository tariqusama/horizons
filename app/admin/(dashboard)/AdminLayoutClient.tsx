'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getProfile, Profile } from '../../../lib/api/profile';
import { getNotifications, markAsRead, Notification } from '../../../lib/api/notifications';
import { useAuth } from '@/contexts/AuthContext';

/* ---------- Small inline icon set ---------- */
const Icon = {
    dashboard: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>,
    tickets: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8a2 2 0 0 0 0-4V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2" /></svg>,
    revenue: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    service: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    users: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    role: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="9" r="3.5" /><path d="M2.5 20a6 6 0 0 1 12 0" /><circle cx="18" cy="7" r="2.2" /><path d="M15.5 13.5a4.2 4.2 0 0 1 6.5 3.5" /></svg>,
    shield: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    alert: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    book: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    team: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    assignment: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21 12 17.5 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>,
    caseAssign: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 8v6M19 11h6" /></svg>,
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    globe: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
    analytics: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6.5 3.8" /></svg>,
    bell: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    audit: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 8 12 12 14.5 14" /><path d="M3.5 8.5A9 9 0 0 1 8 3.5" /></svg>,
    grid: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
    chevron: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    signout: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    menu: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
    close: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

const navItems = [
    { label: 'Dashboard', icon: Icon.dashboard, href: '/admin', bg: '#E3755D', fg: '#FFFFFF' },
    { label: 'Tickets', icon: Icon.tickets, href: '/admin/tickets', bg: '#FBE1E6', fg: '#D6497A' },
    { label: 'Revenue Dashboard', icon: Icon.revenue, href: '/admin/revenue', bg: '#DDF3E4', fg: '#2F8A5F' },
    { label: 'Service & Pricing', icon: Icon.service, href: '/admin/service-pricing', bg: '#E8E7E3', fg: '#5B6472' },
    { label: 'User Management', icon: Icon.users, href: '/admin/users', bg: '#DCEBFB', fg: '#2F6FB3' },
    { label: 'Role Management', icon: Icon.role, href: '/admin/roles', bg: '#EAE1FA', fg: '#7B54C9' },
    { label: 'Assignment Request', icon: Icon.assignment, href: '/admin/assignment-requests', bg: '#FBEFD1', fg: '#B98A0A' },
    { label: 'Case Assignments', icon: Icon.caseAssign, href: '/admin/case-assignments', bg: '#E1F2D9', fg: '#5A9A2F' },
    { label: 'Control Center', icon: Icon.shield, href: '/admin/control-center', bg: '#F0F6EA', fg: '#4D7C2B' },
    { label: 'Stuck Applications', icon: Icon.alert, href: '/admin/stuck-applications', bg: '#FFF1F1', fg: '#C0392B' },
    { label: 'Guide Engine', icon: Icon.book, href: '/admin/guide-engine', bg: '#FFF9ED', fg: '#B98A0A' },
    { label: 'Staff Performance', icon: Icon.team, href: '/admin/staff-performance', bg: '#EAF5FF', fg: '#2F6FB3' },
    { label: 'Global Search', icon: Icon.globe, href: '/admin/search', bg: '#D2F0EF', fg: '#1E9C97' },
    { label: 'Analytics', icon: Icon.analytics, href: '/admin/analytics', bg: '#E9E4FB', fg: '#7259C9' },
    { label: 'Notifications', icon: Icon.bell, href: '/admin/notifications', bg: '#DDEAFB', fg: '#3D7BC9' },
    { label: 'Audit Logs', icon: Icon.audit, href: '/admin/audit-logs', bg: '#D7F1EE', fg: '#279E92' },
];

/* ---------- Sidebar content shared between desktop & mobile drawer ---------- */
function SidebarContent({ pathname, logout, onLinkClick }: { pathname: string | null; logout: () => void; onLinkClick?: () => void }) {
    return (
        <>
            <div className="flex items-center justify-center px-2 mb-8">
                <div className="w-full max-w-[150px]">
                    <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="object-contain" />
                </div>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[#B7B4AA] px-2 mb-3">Main</div>

            <div className="flex flex-col flex-1 min-h-0">
                <nav className="flex-1 min-h-0 space-y-1.5 overflow-y-auto pr-1 sidebar-scrollbar">
                    {navItems.map((item) => {
                        const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={onLinkClick}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'bg-[#101F38] text-white' : 'text-[#5B6472] hover:bg-[#F5F4F1] hover:text-[#101F38]'}`}
                            >
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: item.bg, color: item.fg }}
                                >
                                    <item.icon width={15} height={15} />
                                </span>
                                <span className="truncate">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-4">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 bg-[#E3755D] hover:bg-[#C93500] text-white font-bold text-sm py-3.5 rounded-full transition-colors shadow-sm">
                        <Icon.signout width={16} height={16} />
                        Signout
                    </button>
                </div>
            </div>
        </>
    );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, isLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check authorization
    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/dashboard');
                return;
            }

            const role = user.role.toLowerCase();
            if (!role.includes('admin') && !role.includes('manager')) {
                router.push('/dashboard');
            } else {
                setAuthorized(true);
            }
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchLayoutData = async () => {
            try {
                const [profileData, notificationsData] = await Promise.all([
                    getProfile(),
                    getNotifications()
                ]);
                setProfile(profileData);
                setUnreadCount(notificationsData.filter(n => !n.read_at).length);
                setNotifications(notificationsData);
            } catch (err) {
                console.error('Failed to load layout data', err);
            }
        };
        fetchLayoutData();
    }, [pathname]);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-[#F5F4F1] flex font-body p-2 sm:p-4 gap-2 sm:gap-4">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col px-4 py-6 shadow-2xl transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F4F1] text-[#5B6472] hover:text-[#101F38] transition-colors"
                >
                    <Icon.close width={16} height={16} />
                </button>
                <SidebarContent pathname={pathname} logout={logout} onLinkClick={() => setSidebarOpen(false)} />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white rounded-[24px] shadow-sm px-4 py-6 h-[calc(100vh-32px)] overflow-hidden sticky top-4">
                <SidebarContent pathname={pathname} logout={logout} />
            </aside>

            {/* Main column */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Topbar */}
                <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 mb-2">
                    {/* Hamburger – mobile only */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-full bg-white border border-[#ECE9E2] flex items-center justify-center text-[#5B6472] hover:text-[#101F38] transition-colors shrink-0"
                        aria-label="Open menu"
                    >
                        <Icon.menu width={18} height={18} />
                    </button>

                    <div className="flex-1 relative min-w-0">
                        <Icon.search width={16} height={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B7B4AA]" />
                        <input
                            type="text"
                            placeholder="Search clients, cases, tickets..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#ECE9E2] bg-white text-sm text-[#101F38] placeholder-[#B7B4AA] outline-none focus:border-[#E3755D] transition-colors"
                        />
                    </div>

                    <button className="w-10 h-10 rounded-full bg-white border border-[#ECE9E2] flex items-center justify-center text-[#5B6472] hover:text-[#101F38] transition-colors shrink-0 hidden sm:flex">
                        <Icon.grid width={17} height={17} />
                    </button>

                    <div className="relative shrink-0">
                        <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-10 h-10 rounded-full bg-white border border-[#ECE9E2] flex items-center justify-center text-[#5B6472] hover:text-[#101F38] transition-colors">
                            <Icon.bell width={17} height={17} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E3755D] text-white text-[10px] font-bold flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-[#F8F9FA]">
                                    <h3 className="font-bold text-[#1B3A64] text-sm">Notifications</h3>
                                    <div className="flex items-center gap-3">
                                        <button onClick={async () => { await markAsRead(); const data = await getNotifications(); setNotifications(data); setUnreadCount(data.filter(n => !n.read_at).length); }} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Mark all as read</button>
                                    </div>
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
                                                <div className="w-3 h-3 mt-2 rounded-full shrink-0" style={{ background: isUnread ? '#E3755D' : '#D1D5DB' }}></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <p className={`text-sm ${isUnread ? 'font-black text-[#101F38]' : 'font-bold text-[#101F38]'}`}>{parsedData.title}</p>
                                                        <span className="text-[10px] font-semibold text-[#8A8F98] whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className={`text-sm ${isUnread ? 'text-[#101F38] font-medium' : 'text-[#5B6472]'}`}>{parsedData.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="px-5 py-3 border-t border-gray-100 text-center bg-[#F8F9FA]">
                                    <Link href="/admin/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#E3755D] hover:text-[#C8634D]">
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/admin/profile" className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full bg-white border border-[#ECE9E2] hover:border-[#E3755D]/50 transition-colors shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#F2A65A] to-[#5B3B8C] flex items-center justify-center text-white font-bold text-xs uppercase">
                            {profile?.profile_picture_url ? (
                                <img src={profile.profile_picture_url} alt={profile?.name || 'Profile'} className="h-full w-full object-cover object-center block rounded-full" />
                            ) : (
                                profile?.name?.substring(0, 2) || 'AD'
                            )}
                        </div>
                        <span className="text-sm font-semibold text-[#101F38] hidden sm:inline">{profile?.name || 'Loading...'}</span>
                        <Icon.chevron width={14} height={14} className="text-[#8A8F98] hidden sm:block" />
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}