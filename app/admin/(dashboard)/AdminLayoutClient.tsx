'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getProfile, Profile } from '../../../lib/api/profile';
import { getNotifications, markAsRead, clearAllNotifications, Notification } from '../../../lib/api/notifications';
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
    cases: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    target: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
    checklist: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>,
};

type MenuItem = { href: string; label: string; icon?: any; bg?: string; fg?: string };
type MenuGroup = { title: string; collapsible?: boolean; defaultOpen?: boolean; items: MenuItem[] };

const adminMenu: MenuGroup[] = [
    {
        title: "Main",
        items: [
            { label: 'Dashboard', icon: Icon.dashboard, href: '/admin', bg: '#f97316', fg: '#FFFFFF' },
            { label: 'Case Management', icon: Icon.cases, href: '/admin/cases', bg: '#E8E2F7', fg: '#5B3B8C' },
            { label: 'Tickets', icon: Icon.tickets, href: '/admin/tickets', bg: '#FBE1E6', fg: '#D6497A' },
            { label: 'Revenue Dashboard', icon: Icon.revenue, href: '/admin/revenue', bg: '#DDF3E4', fg: '#2F8A5F' },
            { label: 'Service & Pricing', icon: Icon.service, href: '/admin/service-pricing', bg: '#E8E7E3', fg: '#5B6472' },
            { label: 'Document Checklists', icon: Icon.checklist, href: '/admin/document-checklists', bg: '#FFF5F0', fg: '#EA580C' },
            { label: 'User Management', icon: Icon.users, href: '/admin/users', bg: '#DCEBFB', fg: '#2F6FB3' },
            { label: 'Role Management', icon: Icon.role, href: '/admin/roles', bg: '#EAE1FA', fg: '#7B54C9' },
            { label: 'Assignment Request', icon: Icon.assignment, href: '/admin/assignment-requests', bg: '#FBEFD1', fg: '#B98A0A' },
            { label: 'Case Assignments', icon: Icon.caseAssign, href: '/admin/case-assignments', bg: '#E1F2D9', fg: '#5A9A2F' },
            { label: 'Control Center', icon: Icon.shield, href: '/admin/control-center', bg: '#F0F6EA', fg: '#4D7C2B' },
            { label: 'Stuck Applications', icon: Icon.alert, href: '/admin/stuck-applications', bg: '#FFF1F1', fg: '#C0392B' },
            { label: 'Guide Engine', icon: Icon.book, href: '/admin/guide-engine', bg: '#FFF9ED', fg: '#B98A0A' },
            { label: 'Signup Setup', icon: Icon.target, href: '/admin/signup-setup', bg: '#F3E8FF', fg: '#7E22CE' },
            { label: 'Staff Performance', icon: Icon.team, href: '/admin/staff-performance', bg: '#EAF5FF', fg: '#2F6FB3' },
            { label: 'Global Search', icon: Icon.globe, href: '/admin/search', bg: '#D2F0EF', fg: '#1E9C97' },
            { label: 'Analytics', icon: Icon.analytics, href: '/admin/analytics', bg: '#E9E4FB', fg: '#7259C9' },
            { label: 'Notifications', icon: Icon.bell, href: '/admin/notifications', bg: '#DDEAFB', fg: '#3D7BC9' },
            { label: 'Audit Logs', icon: Icon.audit, href: '/admin/audit-logs', bg: '#D7F1EE', fg: '#279E92' },
        ]
    },
    {
        title: "Document Checklist",
        collapsible: true,
        defaultOpen: true,
        items: [
            { href: "/admin/document-checklists?type=spouse_abroad", label: "Application for Spouse Abroad" },
            { href: "/admin/document-checklists?type=parent_abroad", label: "Application for Parent Abroad" },
            { href: "/admin/document-checklists?type=child_abroad", label: "Application for Child Abroad" },
            { href: "/admin/document-checklists?type=sibling_abroad", label: "Application for Sibling Abroad" },
            { href: "/admin/document-checklists?type=k1_fiance", label: "Application for K-1 Fiancé(e) Petition" },
            { href: "/admin/document-checklists?type=spouse_aos", label: "Application for Marriage-Based Adjustment of Status (AOS)" },
            { href: "/admin/document-checklists?type=parent_aos", label: "Application for Parent Adjustment of Status (AOS)" },
            { href: "/admin/document-checklists?type=child_aos", label: "Application for Child Adjustment of Status (AOS)" },
            { href: "/admin/document-checklists?type=i90", label: "Application to Replace Permanent Resident Card (I-90)" },
            { href: "/admin/document-checklists?type=i751", label: "Application for Removal of Conditions on Residence (I-751)" },
            { href: "/admin/document-checklists?type=daca", label: "Application for DACA Renewal (I-821D)" },
            { href: "/admin/document-checklists?type=n400", label: "Application for Naturalization (N-400)" }
        ]
    },
    {
        title: "USCIS Resources",
        collapsible: true,
        defaultOpen: true,
        items: [
            { href: "https://www.uscis.gov/forms/all-forms/uscis-lockbox-filing-locations-chart-for-certain-family-based-forms", label: "USCIS Lockbox Addresses" },
            { href: "https://www.uscis.gov/forms/filing-fees", label: "USCIS Filing Fees" },
            { href: "https://www.uscis.gov/forms", label: "USCIS Forms" },
            { href: "https://www.uscis.gov/news-alerts", label: "USCIS News & Alerts" }
        ]
    }
];

/* ---------- Sidebar content shared between desktop & mobile drawer ---------- */
function SidebarContent({
    pathname,
    logout,
    openGroups,
    toggleGroup,
    onLinkClick
}: {
    pathname: string | null;
    logout: () => void;
    openGroups: Record<string, boolean>;
    toggleGroup: (title: string) => void;
    onLinkClick?: () => void;
}) {
    return (
        <>
            <div className="px-6 pt-6 pb-4 flex justify-start">
                <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="h-12 w-auto" />
            </div>

            <nav className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1 px-4 sidebar-scrollbar">
                    {adminMenu.map((group) => {
                        const isOpen = group.collapsible ? openGroups[group.title] : true;
                        return (
                            <div key={group.title} className="space-y-1">
                                {group.title !== 'Main' && (
                                    <div className="flex items-center justify-between px-2 pt-4 pb-1">
                                        <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{group.title}</div>
                                        {group.collapsible && (
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(group.title)}
                                                className="text-slate-400 hover:text-slate-600 transition"
                                            >
                                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${isOpen ? 'rotate-180' : ''} transition-transform`}>
                                                    <Icon.chevron width={14} height={14} />
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                                {(!group.collapsible || isOpen) && (
                                    <div className="space-y-1">
                                        {group.items.map((item) => {
                                            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
                                            const isExternal = item.href.startsWith('http');
                                            
                                            if (group.collapsible && !item.icon) {
                                                return isExternal ? (
                                                    <a
                                                        key={item.label}
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        {item.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        onClick={onLinkClick}
                                                        className="block px-3 py-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={onLinkClick}
                                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${isActive ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    <span
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-orange-500 text-white' : ''}`}
                                                        style={!isActive ? { backgroundColor: item.bg, color: item.fg } : {}}
                                                    >
                                                        {item.icon && <item.icon width={18} height={18} />}
                                                    </span>
                                                    <span className="truncate">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 mt-2">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:from-orange-600 hover:to-orange-700 transition-all">
                        <Icon.signout width={20} height={20} />
                        Signout
                    </button>
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

    const [openGroups, setOpenGroups] = useState(() =>
        Object.fromEntries(
            adminMenu
                .filter((group) => group.collapsible)
                .map((group) => [group.title, group.defaultOpen ?? false])
        )
    );

    const toggleGroup = (groupTitle: string) => {
        setOpenGroups((current) => ({
            ...current,
            [groupTitle]: !current[groupTitle],
        }));
    };

    // Check authorization — allow only explicit admins for admin layout
    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            const role = (user.role || '').toString().toLowerCase();
            if (!role.includes('admin')) {
                router.push('/dashboard');
            } else {
                setAuthorized(true);
            }
        }
    }, [user, isLoading, router]);

    const fetchLayoutData = async () => {
        try {
            const [profileData, notificationsData] = await Promise.all([
                getProfile(),
                getNotifications()
            ]);
            setProfile(profileData);
            
            // Filter notifications based on user request
            const allowedKeywords = ['new user', 'new case', 'case approved', 'assigned case approved'];
            const filteredNotifications = notificationsData.filter((n) => {
                const parsedData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                const title = (parsedData?.title || '').toLowerCase();
                return allowedKeywords.some(keyword => title.includes(keyword));
            });

            setUnreadCount(filteredNotifications.filter(n => !n.read_at).length);
            setNotifications(filteredNotifications);
        } catch (err) {
            console.error('Failed to load layout data', err);
        }
    };

    const toggleNotifications = async () => {
        if (!showNotifications) {
            await fetchLayoutData();
        }
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        if (authorized) {
            fetchLayoutData();
            const interval = setInterval(fetchLayoutData, 30000);
            return () => clearInterval(interval);
        }
    }, [pathname, authorized]);

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
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 lg:hidden rounded-r-3xl overflow-y-auto hide-scrollbar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <Icon.close width={16} height={16} />
                </button>
                <SidebarContent 
                    pathname={pathname} 
                    logout={logout} 
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    onLinkClick={() => setSidebarOpen(false)} 
                />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col fixed left-4 top-4 h-[calc(100vh-2rem)] w-72 z-40">
                <div className="h-full flex flex-col rounded-3xl border border-slate-200/70 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="flex flex-col flex-1 min-h-0 hide-scrollbar">
                        <SidebarContent 
                            pathname={pathname} 
                            logout={logout} 
                            openGroups={openGroups}
                            toggleGroup={toggleGroup}
                        />
                    </div>
                </div>
            </aside>

            {/* Main column */}
            <div className="flex-1 min-w-0 flex flex-col lg:ml-[19rem]">
                {/* Topbar */}
                <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mb-2">
                    {/* Hamburger – mobile only */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-full bg-white border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shrink-0"
                        aria-label="Open menu"
                    >
                        <Icon.menu width={18} height={18} />
                    </button>

                    <div className="flex-1 relative min-w-0 ">
                        <Icon.search width={16} height={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search clients, cases, tickets..."
                            className="w-full pl-11 pr-4 py-2 rounded-full border border-slate-200/50 bg-white text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-200 transition-colors"
                        />
                    </div>

                    <button className="w-10 h-10 rounded-full bg-white border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shrink-0 hidden sm:flex">
                        <Icon.grid width={18} height={18} />
                    </button>

                    <div className="relative shrink-0">
                        <button onClick={toggleNotifications} className="relative w-10 h-10 rounded-full bg-white border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
                            <Icon.bell width={18} height={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-[-1rem] sm:right-0 mt-2 w-[calc(100vw-2rem)] max-w-[300px] sm:max-w-[320px] bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden z-50">
                                <div className="px-5 py-3 border-b border-slate-200/50 flex justify-between items-center bg-white/50">
                                    <h3 className="font-semibold text-slate-900 text-[13px] sm:text-sm">Notifications</h3>
                                    <div className="flex items-center gap-3">
                                        <button onClick={async () => { await markAsRead(); await fetchLayoutData(); }} className="text-[11px] sm:text-xs text-slate-600 hover:text-orange-600 font-medium">Mark all as read</button>
                                    </div>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto">
                                    {notifications.length === 0 && (
                                        <div className="p-6 text-center text-[13px] sm:text-sm text-slate-500">No notifications</div>
                                    )}
                                    {notifications.map((n) => {
                                        const parsedData = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
                                        const isUnread = !n.read_at;
                                        return (
                                            <div key={n.id} className={`p-4 transition-colors flex gap-3 items-start border-b border-slate-100 ${isUnread ? 'bg-white/50' : 'bg-white'}`}>
                                                <div className="mt-1 shrink-0">
                                                    {parsedData?.type === 'message' && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#ea580c" : "#94a3b8"} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                    )}
                                                    {parsedData?.type === 'alert' && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#ea580c" : "#94a3b8"} strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                    )}
                                                    {parsedData?.type === 'system' && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#334155" : "#94a3b8"} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                                    )}
                                                    {parsedData?.type === 'status' && (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isUnread ? "#10b981" : "#94a3b8"} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                                    )}
                                                    {!parsedData?.type && (
                                                        <div className="w-2 h-2 mt-1 rounded-full shrink-0" style={{ background: isUnread ? '#ea580c' : 'transparent' }}></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <p className={`text-[13px] sm:text-sm ${isUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-900'}`}>{parsedData.title}</p>
                                                        <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <p className={`text-[12px] sm:text-sm ${isUnread ? 'text-slate-700' : 'text-slate-600'}`}>{parsedData.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="px-5 py-3 border-t border-slate-200/50 text-center bg-white/50">
                                    <button onClick={async () => { await clearAllNotifications(); await fetchLayoutData(); setShowNotifications(false); }} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
                                        Clear notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/admin/profile" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/50 border border-slate-200/50 hover:bg-slate-100 transition-colors shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-[11px] uppercase">
                            {profile?.profile_picture_url ? (
                                <img src={profile.profile_picture_url} alt={profile?.name || 'Profile'} className="h-full w-full object-cover object-center block rounded-full" />
                            ) : (
                                profile?.name?.substring(0, 2) || 'AD'
                            )}
                        </div>
                        <span className="text-[13px] sm:text-sm font-medium text-slate-700 hidden sm:inline">{profile?.name || 'Loading...'}</span>
                        <Icon.chevron width={14} height={14} className="text-slate-500 hidden sm:block" />
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}