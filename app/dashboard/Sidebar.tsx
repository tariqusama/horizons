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
    const { logout, user } = useAuth();

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

    const stepItems = [
        {
            label: 'Step 1: Getting Started',
            path: '/dashboard/get-started',
            isCurrent: pathname === '/dashboard/get-started',
        },
        ...formsList.map((form, index) => ({
            label: `Step ${index + 2}: ${form.name.replace(/^Form\s+/i, '')}`,
            path: form.path,
            isCurrent: pathname === form.path || pathname === `/dashboard/get-started/dynamic/${form.code}`,
        })),
        {
            label: `Step ${formsList.length + 2}: Document Upload`,
            path: '/dashboard/get-started/document-upload',
            isCurrent: pathname === '/dashboard/get-started/document-upload',
        },
        {
            label: `Step ${formsList.length + 3}: Review and Finish`,
            path: '/dashboard/get-started/submission',
            isCurrent: pathname === '/dashboard/get-started/submission',
        },
    ];

    const currentStepIdx = stepItems.findIndex(s => s.isCurrent);
    const applicantName = user?.name?.split(' ')[0] || 'Applicant';
    const packetTitle = goalTitle
        ? `${applicantName}'s ${goalTitle} Application Packet`
        : `${applicantName}'s Application Packet`;

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} hide-scrollbar`}>
            <div className={styles.logoContainer}>
                <div className={styles.logoMarkWrap}>
                    <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="object-contain" />
                </div>
            </div>

            {isGetStartedFlow ? (
                <div className={styles.navSection}>
                    <div className={styles.packetCard}>
                        <div className={styles.packetBadgeRow}>
                            <span className={styles.progressBadge}>
                                Step {Math.max(1, currentStepIdx + 1)} of {stepItems.length}
                            </span>
                        </div>

                        <h3 className={styles.packetTitle}>{packetTitle}</h3>

                        <div className={styles.stepperContainer}>
                            <div className={styles.stepperTrack} />
                            <div className={styles.packetList}>
                                {stepItems.map((step, index) => {
                                    const isPast = currentStepIdx > -1 && index < currentStepIdx;
                                    const isCurrent = step.isCurrent;

                                    return (
                                        <Link
                                            key={`${step.path}-${index}`}
                                            href={step.path}
                                            onClick={onClose}
                                            className={`${styles.packetRow} ${isCurrent ? styles.packetRowCurrent : ''}`}
                                        >
                                            <span className={`${styles.packetCircle} ${isCurrent ? styles.packetCircleCurrent : (isPast ? styles.packetCircleDone : styles.packetCirclePending)}`}>
                                                {isPast ? '✓' : String(index + 1)}
                                            </span>
                                            <span className={`${styles.packetLabel} ${isCurrent ? styles.packetLabelCurrent : ''}`}>{step.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <Link href="/dashboard" onClick={onClose} className={styles.backLink}>
                            <span className={styles.backArrow}>←</span>
                            <span>Back to Dashboard</span>
                        </Link>
                    </div>
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
                <span className={styles.signoutAvatar}>{user?.name?.charAt(0)?.toUpperCase() || 'N'}</span>
                <span className={styles.signoutText}>→ Signout</span>
            </button>
        </aside>
    );
}
