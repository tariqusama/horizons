"use client";

import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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

    useEffect(() => {
        if (isGetStartedFlow) {
            api.get('/applications').then((res) => {
                if (res.data && res.data.length > 0) {
                    setGoalTitle(res.data[0].title);
                }
            }).catch(err => console.error(err));
        }
    }, [isGetStartedFlow]);

    const getDynamicSteps = () => {
        const baseSteps = [
            { path: '/dashboard/get-started', name: '1. Start Application' }
        ];

        let formSteps: { path: string; name: string }[] = [];
        if (!goalTitle || goalTitle.includes('Replace or fix a Green Card')) {
            formSteps = [
                { path: '/dashboard/get-started/i-90', name: '2. I-90 Form' },
                { path: '/dashboard/get-started/g-1145', name: '3. G-1145 e-Notification' }
            ];
        } else if (goalTitle.includes('DACA')) {
            formSteps = [
                { path: '/dashboard/get-started/i-821d', name: '2. I-821D Form' },
                { path: '/dashboard/get-started/i-765', name: '3. I-765 Form' },
                { path: '/dashboard/get-started/i-765ws', name: '4. I-765WS Worksheet' }
            ];
        } else if (goalTitle.includes('Naturalization') || goalTitle.includes('Citizenship')) {
            formSteps = [
                { path: '/dashboard/get-started/n-400', name: '2. N-400 Form' }
            ];
        } else if (goalTitle.includes('fiancé(e) or spouse/relative')) {
            formSteps = [
                { path: '/dashboard/get-started/i-130', name: '2. I-130 Petition' },
                { path: '/dashboard/get-started/i-130a', name: '3. I-130A Supp.' }
            ];
        } else if (goalTitle.includes('Adjust status')) {
            formSteps = [
                { path: '/dashboard/get-started/i-130', name: '2. I-130 Form' },
                { path: '/dashboard/get-started/i-485', name: '3. I-485 Form' },
                { path: '/dashboard/get-started/i-864', name: '4. I-864 Affidavit' }
            ];
        } else if (goalTitle.includes('Remove conditions')) {
            formSteps = [
                { path: '/dashboard/get-started/i-751', name: '2. I-751 Form' }
            ];
        } else {
            formSteps = [
                { path: '/dashboard/get-started/forms', name: '2. Required Forms' }
            ];
        }

        const nextIndex = formSteps.length + 2;
        const endSteps = [
            { path: '/dashboard/get-started/document-upload', name: `${nextIndex}. Document Upload` },
            { path: '/dashboard/get-started/submission', name: `${nextIndex + 1}. Submission` }
        ];

        return [...baseSteps, ...formSteps, ...endSteps];
    };

    const dynamicSteps = getDynamicSteps();

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                <Image src="/horizonlogo.png" alt="Horizon Pathways" width={150} height={40} className="object-contain" />
            </div>

            {isGetStartedFlow ? (
                <div className={styles.navSection}>
                    <div className={styles.navSectionTitle}>MAIN</div>
                    {dynamicSteps.map((step, idx) => (
                        <Link
                            key={idx}
                            href={step.path}
                            onClick={onClose}
                            className={pathname === step.path ? styles.flowNavItemActive : styles.flowNavItem}
                        >
                            {step.name}
                        </Link>
                    ))}
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
