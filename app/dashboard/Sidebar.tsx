"use client";

import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from '@/contexts/AuthContext';
import { getFormsList } from './get-started/formsHelper';
import styles from "./dashboardLayout.module.css";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const isGetStartedFlow = pathname.startsWith('/dashboard/get-started');
    const { logout } = useAuth();

    const [goalTitle, setGoalTitle] = useState<string>('');
    const [completedForms, setCompletedForms] = useState<string[]>([]);

    useEffect(() => {
        if (isGetStartedFlow) {
            api.get('/applications').then((res) => {
                if (res.data && res.data.length > 0) {
                    const latest = res.data[0];
                    setGoalTitle(latest.title || '');
                    // derive completed forms from application.form_data keys
                    const fd = latest.form_data || {};
                    const keys = Object.keys(fd || {}).map(k => k.toLowerCase());
                    setCompletedForms(keys);
                }
            }).catch(err => console.error(err));
        }
    }, [isGetStartedFlow]);

    const formsList = getFormsList(goalTitle, { allowFallback: false });

    const isFormRouteActive = formsList.some(f => pathname === f.path) || pathname === '/dashboard/get-started/forms';

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} hide-scrollbar`}>
            <div className={styles.logoContainer}>
                <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="object-contain" />
            </div>

            {isGetStartedFlow ? (
                <div className={styles.navSection}>
                    <div className={styles.navSectionTitle}>MAIN</div>

                    {/* Forms Steps */}
                    {formsList.map((form, fIdx) => {
                        const isSubActive = pathname === form.path;
                        const normalizedCode = form.code.replace(/-/g, '').toLowerCase();
                        const isCompleted = completedForms.includes(normalizedCode);
                        return (
                            <Link
                                key={fIdx}
                                href={form.path}
                                onClick={onClose}
                                className={`flex items-center justify-between px-4 py-3 rounded-[1rem] transition-colors mb-2 font-bold text-[0.95rem] ${isSubActive
                                    ? 'bg-[#2563EB] text-white shadow-sm'
                                    : 'text-[#475569] hover:bg-[#f8fafc]'
                                    }`}
                            >
                                <span>Step {fIdx + 1}</span>
                                <span className={isSubActive ? 'text-white font-bold' : isCompleted ? 'text-emerald-500 font-bold' : 'text-transparent'}>✓</span>
                            </Link>
                        );
                    })}

                    {/* Step: Document Upload */}
                    <Link
                        href="/dashboard/get-started/document-upload"
                        onClick={onClose}
                        className={pathname === '/dashboard/get-started/document-upload' ? styles.flowNavItemActive : styles.flowNavItem}
                    >
                        {formsList.length + 1}. Document Upload
                    </Link>

                    {/* Step: Submission */}
                    <Link
                        href="/dashboard/get-started/submission"
                        onClick={onClose}
                        className={pathname === '/dashboard/get-started/submission' ? styles.flowNavItemActive : styles.flowNavItem}
                    >
                        {formsList.length + 2}. Submission
                    </Link>
                </div>
            ) : (
                <div className={styles.navSection}>
                    <div className={styles.navSectionTitle}>MAIN</div>
                    <Link href="/dashboard" onClick={onClose} className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard' ? { backgroundColor: '#F0F5FF', color: '#3B82F6' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                            </svg>
                        </div>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/purchases" className={`${styles.navItem} ${pathname === '/dashboard/purchases' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard/purchases' ? { backgroundColor: '#FAF5FF', color: '#A855F7' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z" />
                            </svg>
                        </div>
                        Service & Pricing
                    </Link>
                    <Link href="/dashboard/notifications" className={`${styles.navItem} ${pathname === '/dashboard/notifications' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard/notifications' ? { backgroundColor: '#FFF7ED', color: '#F97316' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
                        </div>
                        Notifications
                    </Link>
                    <Link href="/dashboard/chat" className={`${styles.navItem} ${pathname.startsWith('/dashboard/chat') ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={!pathname.startsWith('/dashboard/chat') ? { backgroundColor: '#F0FDF4', color: '#22C55E' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                        </div>
                        Messages
                    </Link>
                    <Link href="/dashboard/applications" className={`${styles.navItem} ${pathname === '/dashboard/applications' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard/applications' ? { backgroundColor: '#ECFEFF', color: '#06B6D4' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        My Applications
                    </Link>
                    <Link href="/dashboard/documents" className={`${styles.navItem} ${pathname === '/dashboard/documents' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard/documents' ? { backgroundColor: '#FDF2F8', color: '#EC4899' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" />
                            </svg>
                        </div>
                        Documents
                    </Link>
                    <Link href="/dashboard/helpline" className={`${styles.navItem} ${pathname === '/dashboard/helpline' ? styles.active : ''}`}>
                        <div className={styles.navIcon} style={pathname !== '/dashboard/helpline' ? { backgroundColor: '#FFF5F0', color: '#FA6514' } : undefined}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </div>
                        Helpline
                    </Link>
                </div>
            )}

            <button onClick={logout} className={styles.signoutBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Signout
            </button>
        </aside>
    );
}
