"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./dashboardLayout.module.css";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isGetStartedFlow = pathname.startsWith('/dashboard/get-started');

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="#1B3A64"/>
                        <path d="M12 25L20 15L28 25H12Z" fill="white"/>
                    </svg>
                </div>
                <div>
                    <div className={styles.logoText}>Horizon</div>
                    <div className={styles.logoSub}>PATHWAYS</div>
                </div>
            </div>

            {isGetStartedFlow ? (
                <div className={styles.navSection}>
                    <div className={styles.navSectionTitle}>MAIN</div>
                    <Link href="/dashboard/get-started" onClick={onClose} className={pathname === '/dashboard/get-started' ? styles.flowNavItemActive : styles.flowNavItem}>
                        1. Start Application
                    </Link>
                    <Link href="/dashboard/get-started/i-90" onClick={onClose} className={pathname === '/dashboard/get-started/i-90' ? styles.flowNavItemActive : styles.flowNavItem}>
                        2. I-90 Form
                    </Link>
                    <Link href="/dashboard/get-started/g-1145" onClick={onClose} className={pathname === '/dashboard/get-started/g-1145' ? styles.flowNavItemActive : styles.flowNavItem}>
                        3. G-1145 e-Notification
                    </Link>
                    <Link href="/dashboard/get-started/document-upload" onClick={onClose} className={pathname === '/dashboard/get-started/document-upload' ? styles.flowNavItemActive : styles.flowNavItem}>
                        4. Document Upload
                    </Link>
                    <Link href="/dashboard/get-started/submission" onClick={onClose} className={pathname === '/dashboard/get-started/submission' ? styles.flowNavItemActive : styles.flowNavItem}>
                        5. Submission
                    </Link>
                </div>
            ) : (
                <div className={styles.navSection}>
                    <div className={styles.navSectionTitle}>MAIN</div>
                    <Link href="/dashboard" onClick={onClose} className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
                        <div className={styles.navIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                            </svg>
                        </div>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/purchases" className={`${styles.navItem} ${pathname === '/dashboard/purchases' ? styles.active : ''}`}>
                        <div className={styles.navIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z" />
                            </svg>
                        </div>
                        Service & Pricing
                    </Link>
                    <Link href="/dashboard/notifications" className={`${styles.navItem} ${pathname === '/dashboard/notifications' ? styles.active : ''}`}>
                        <div className={styles.navIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
                        </div>
                        Notifications
                    </Link>
                    <Link href="/dashboard/applications" className={`${styles.navItem} ${pathname === '/dashboard/applications' ? styles.active : ''}`}>
                        <div className={styles.navIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        My Applications
                    </Link>
                    <Link href="/dashboard/helpline" className={`${styles.navItem} ${pathname === '/dashboard/helpline' ? styles.active : ''}`}>
                        <div className={styles.navIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </div>
                        Helpline
                    </Link>
                </div>
            )}

            <Link href="/" className={styles.signoutBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Signout
            </Link>
        </aside>
    );
}
