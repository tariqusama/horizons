'use client';
import Link from "next/link";
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getNotifications, markAsRead, Notification } from '@/lib/api/notifications';

type MenuItem = { href: string; label: string; icon?: React.ReactNode; iconBg?: string; iconFg?: string };
type MenuGroup = { title: string; collapsible?: boolean; defaultOpen?: boolean; items: MenuItem[] };

const managerMenu: MenuGroup[] = [
    {
        title: "Main",
        items: [
            {
                href: "/manager",
                label: "Dashboard",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                ),
                iconBg: '#FDECE2',
                iconFg: '#E3755D'
            },
            {
                href: "/manager/notifications",
                label: "Notifications",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                ),
                iconBg: '#EAF4FF',
                iconFg: '#2563EB'
            },
            {
                href: "/manager/assigned-cases",
                label: "Assigned Cases",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        <path d="M9 14l2 2 4-4" />
                    </svg>
                ),
                iconBg: '#E5F1FF',
                iconFg: '#2563EB'
            },
            {
                href: "/manager/assigned-cases?filter=urgent",
                label: "Urgent Cases",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <circle cx="12" cy="16" r="1" />
                    </svg>
                ),
                iconBg: '#FEE2E2',
                iconFg: '#DC2626'
            },
            {
                href: "/manager/assigned-cases?filter=high",
                label: "High Priority",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                ),
                iconBg: '#FDEDE2',
                iconFg: '#E3755D'
            },
            {
                href: "/manager/pending-tasks",
                label: "Pending Tasks",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="9" y1="10" x2="15" y2="10" />
                        <line x1="9" y1="14" x2="15" y2="14" />
                        <line x1="9" y1="18" x2="13" y2="18" />
                    </svg>
                ),
                iconBg: '#FEF3C7',
                iconFg: '#A16207'
            },
            {
                href: "/manager/messages",
                label: "New Messages",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                ),
                iconBg: '#EFF6FF',
                iconFg: '#1D4ED8'
            },
            {
                href: "/manager/cases-awaiting-review",
                label: "Cases Awaiting Review",
                icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 3h5v5" />
                        <path d="M21 3l-9 8-5-4" />
                        <path d="M3 21h5v-5" />
                    </svg>
                ),
                iconBg: '#ECFDF5',
                iconFg: '#16A34A'
            }
        ]
    },
    {
        title: "Document Checklist",
        collapsible: true,
        defaultOpen: true,
        items: [
            { href: "/manager/document-checklists?type=spouse_abroad", label: "Application for Spouse Abroad" },
            { href: "/manager/document-checklists?type=parent_abroad", label: "Application for Parent Abroad" },
            { href: "/manager/document-checklists?type=child_abroad", label: "Application for Child Abroad" },
            { href: "/manager/document-checklists?type=sibling_abroad", label: "Application for Sibling Abroad" },
            { href: "/manager/document-checklists?type=k1_fiance", label: "Application for K-1 Fiancé(e) Petition" },
            { href: "/manager/document-checklists?type=spouse_aos", label: "Application for Marriage-Based Adjustment of Status (AOS)" },
            { href: "/manager/document-checklists?type=parent_aos", label: "Application for Parent Adjustment of Status (AOS)" },
            { href: "/manager/document-checklists?type=child_aos", label: "Application for Child Adjustment of Status (AOS)" },
            { href: "/manager/document-checklists?type=i90", label: "Application to Replace Permanent Resident Card (I-90)" },
            { href: "/manager/document-checklists?type=i751", label: "Application for Removal of Conditions on Residence (I-751)" },
            { href: "/manager/document-checklists?type=daca", label: "Application for DACA Renewal (I-821D)" },
            { href: "/manager/document-checklists?type=n400", label: "Application for Naturalization (N-400)" }
        ]
    },
    {
        title: "USCIS Resources",
        collapsible: true,
        defaultOpen: true,
        items: [
            { href: "https://www.uscis.gov/forms/filing-fees/uscis-lockbox-addresses", label: "USCIS Lockbox Addresses" },
            { href: "https://www.uscis.gov/forms/filing-fees", label: "USCIS Filing Fees" },
            { href: "https://www.uscis.gov/forms", label: "USCIS Forms" },
            { href: "https://www.uscis.gov/news-alerts", label: "USCIS News & Alerts" }
        ]
    }
];

/* ---------- Shared sidebar nav content ---------- */
function ManagerSidebarContent({
    pathname,
    logout,
    openGroups,
    toggleGroup,
    isActivePath,
    onLinkClick,
    user,
}: {
    pathname: string | null;
    logout: () => void;
    openGroups: Record<string, boolean>;
    toggleGroup: (title: string) => void;
    isActivePath: (href: string) => boolean;
    onLinkClick?: () => void;
    user: any;
}) {
    return (
        <>
            <div className="flex items-center justify-center mb-8 px-2">
                <div className="w-full max-w-[150px]">
                    <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="object-contain" />
                </div>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-wider text-[#B7B4AA] px-2 mb-3">Main</div>

            <nav className="flex-1 min-h-0 space-y-1.5 overflow-y-auto pr-1 sidebar-scrollbar">
                <div className="space-y-6 px-2">
                    {managerMenu.map((group) => {
                        const isOpen = group.collapsible ? openGroups[group.title] : true;
                        return (
                            <div key={group.title} className="space-y-3">
                                {group.title !== 'Main' && (
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] uppercase tracking-widest text-[#9CA3AF] font-bold">{group.title}</div>
                                        {group.collapsible && (
                                            <button
                                                type="button"
                                                onClick={() => toggleGroup(group.title)}
                                                className="text-[#6B7280] hover:text-[#111827] transition"
                                            >
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border border-[#E5E7EB] ${isOpen ? 'rotate-180' : ''} transition-transform`}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="6 9 12 15 18 9" />
                                                    </svg>
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                )}
                                {(!group.collapsible || isOpen) && (
                                    <div className="space-y-1.5">
                                        {group.items.map((item) => {
                                            const isActive = isActivePath(item.href);
                                            const isExternal = item.href.startsWith('http');
                                            if (group.collapsible) {
                                                return isExternal ? (
                                                    <a
                                                        key={item.label}
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block rounded-2xl px-4 py-2 text-sm text-[#475569] hover:bg-[#F8FAFB] transition"
                                                    >
                                                        {item.label}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href}
                                                        onClick={onLinkClick}
                                                        className="block rounded-2xl px-4 py-2 text-sm text-[#475569] hover:bg-[#F8FAFB] transition"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                );
                                            }
                                            const linkClasses = isActive
                                                ? 'flex items-center gap-3 px-3 py-3 rounded-[24px] text-sm font-semibold bg-[#101F38] text-white shadow-[0_10px_30px_rgba(16,31,56,0.12)] transition'
                                                : 'flex items-center gap-3 px-3 py-3 rounded-[24px] text-sm font-semibold text-[#1F2937] bg-white hover:bg-[#F8FAFB] transition';
                                            const iconStyle = {
                                                backgroundColor: isActive ? '#E3755D' : item.iconBg || '#DCEBFB',
                                                color: isActive ? '#FFFFFF' : item.iconFg || '#2F6FB3',
                                            };
                                            return isExternal ? (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={linkClasses}
                                                >
                                                    <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={iconStyle}>
                                                        {item.icon || <span className="text-xs">•</span>}
                                                    </span>
                                                    <span className="truncate">{item.label}</span>
                                                </a>
                                            ) : (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    onClick={onLinkClick}
                                                    className={linkClasses}
                                                >
                                                    <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={iconStyle}>
                                                        {item.icon || <span className="text-xs">•</span>}
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
                </div>
            </nav>

            <div className="mt-6 px-3 pb-2">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#E3755D] text-white py-3.5 text-sm font-bold transition hover:bg-[#C93500] shadow-sm"
                >
                    <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#101F38]">
                        {user?.name?.charAt(0) || 'M'}
                    </span>
                    Signout
                </button>
            </div>
        </>
    );
}

export default function ManagerLayoutClient({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, logout } = useAuth();
    const [authorized, setAuthorized] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState(() =>
        Object.fromEntries(
            managerMenu
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

    const isActivePath = (href: string) => {
        if (!pathname) {
            return false;
        }
        if (href === '/manager') {
            return pathname === '/manager';
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const loadNotifications = async () => {
        setLoadingNotifications(true);
        try {
            const data = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read_at).length);
        } catch (err) {
            console.error('Failed to load notifications', err);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const toggleNotifications = async () => {
        if (!showNotifications) {
            await loadNotifications();
        }
        setShowNotifications((current) => !current);
    };

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

    // Close sidebar & notifications on route change
    useEffect(() => {
        setSidebarOpen(false);
        setShowNotifications(false);
    }, [pathname]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3755D] mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You don't have permission to access the manager portal.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-2.5 bg-[#E3755D] text-white rounded-lg font-semibold hover:bg-[#D3654D] transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F4F1] flex font-body p-2 sm:p-4 gap-2 sm:gap-4">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 flex flex-col px-4 py-6 shadow-2xl transition-transform duration-300 lg:hidden overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F4F1] text-[#5B6472] hover:text-[#101F38] transition-colors"
                    aria-label="Close menu"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
                <ManagerSidebarContent
                    pathname={pathname}
                    logout={logout}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    isActivePath={isActivePath}
                    onLinkClick={() => setSidebarOpen(false)}
                    user={user}
                />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white rounded-[24px] shadow-sm px-4 py-6 h-[calc(100vh-32px)] overflow-hidden sticky top-4">
                <ManagerSidebarContent
                    pathname={pathname}
                    logout={logout}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    isActivePath={isActivePath}
                    user={user}
                />
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Header */}
                <header className="flex items-center gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 mb-2 bg-white rounded-2xl shadow-sm">
                    {/* Hamburger – mobile only */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-full bg-[#F5F4F1] flex items-center justify-center text-[#5B6472] hover:text-[#101F38] transition-colors shrink-0"
                        aria-label="Open menu"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="flex-1 relative min-w-0">
                        <input
                            type="text"
                            placeholder="Search cases, clients, updates..."
                            className="w-full pl-4 pr-4 py-3 rounded-full border border-[#ECE9E2] bg-[#F8F9FA] text-sm text-[#1F2937] placeholder:text-[#9CA3AF] outline-none focus:border-[#E3755D] focus:bg-white transition"
                        />
                    </div>

                    <div className="relative shrink-0">
                        <button onClick={toggleNotifications} className="w-10 h-10 rounded-full bg-white border border-[#ECE9E2] flex items-center justify-center text-[#5B6472] hover:text-[#1B3A64] transition-colors shadow-sm">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-[1.25rem] rounded-full bg-[#E3755D] text-[10px] text-white font-bold px-1.5">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[320px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-gray-100 bg-[#F8F9FA]">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-bold text-[#1B3A64]">Notifications</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={loadNotifications} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Refresh</button>
                                            <button onClick={async () => { await markAsRead(); await loadNotifications(); }} className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">Mark all as read</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 border-b border-gray-100 bg-white">
                                    <Link href="/manager/notifications" className="text-xs text-[#5A6579] hover:text-[#E3755D] font-medium">View all notifications</Link>
                                </div>
                                <div className="max-h-[320px] overflow-y-auto">
                                    {loadingNotifications && (
                                        <div className="p-4 text-sm text-[#6B7280]">Loading notifications...</div>
                                    )}
                                    {!loadingNotifications && notifications.length === 0 && (
                                        <div className="p-4 text-sm text-[#5B6472] text-center">No notifications</div>
                                    )}
                                    {!loadingNotifications && notifications.map((notification) => {
                                        const data = typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data;
                                        const isUnread = !notification.read_at;
                                        return (
                                            <div key={notification.id} className={`p-4 border-b border-gray-100 ${isUnread ? 'bg-[#FDFCFB]' : 'bg-white'} text-sm`}>
                                                <div className="font-semibold text-[#111827]">{data?.title || 'New notification'}</div>
                                                <div className="text-[#6B7280] mt-1">{data?.text || ''}</div>
                                                <div className="text-[11px] text-[#9CA3AF] mt-2">{new Date(notification.created_at).toLocaleString()}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/manager/profile" className="flex items-center gap-2 sm:gap-3 sm:pl-4 sm:border-l sm:border-gray-200 hover:bg-gray-50 rounded-full px-2 py-1 transition-colors shrink-0">
                        <div className="text-right hidden sm:flex flex-col">
                            <span className="text-sm font-semibold text-[#111827]">{user?.name || 'Manager'}</span>
                            <span className="text-xs uppercase tracking-widest text-[#E3755D]">Manager</span>
                        </div>
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-[#1B3A64] text-white font-bold flex items-center justify-center shrink-0">
                            {user?.profile_picture_url ? (
                                <img src={user.profile_picture_url} alt={user?.name || 'Manager avatar'} className="h-full w-full object-cover" />
                            ) : (
                                user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'MG'
                            )}
                        </div>
                    </Link>
                </header>

                <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
