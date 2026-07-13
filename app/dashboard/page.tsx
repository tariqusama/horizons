"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const router = useRouter();

    const openForm = () => router.push('/dashboard/get-started');

    return (
        <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>

                <div className={styles.welcomeBanner}>
                    <div className={styles.welcomeText}>
                        <h1>Welcome back, Shehryar!</h1>
                        <p>Track your immigration applications and documents</p>
                    </div>
                    <button className={styles.chatButton}>
                        <svg className={styles.chatIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Chat with Case Manager
                    </button>
                </div>

                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <span className={styles.metricLabel}>Active Applications</span>
                            <div className={`${styles.metricIcon} ${styles.iconOrange}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" /></svg>
                            </div>
                        </div>
                        <div>
                            <div className={styles.metricValue}>0</div>
                            <div className={styles.metricDesc}>No active applications</div>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <span className={styles.metricLabel}>Total Purchases</span>
                            <div className={`${styles.metricIcon} ${styles.iconGreen}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM4 8h16v11H4V8z" /></svg>
                            </div>
                        </div>
                        <div>
                            <div className={styles.metricValue}>1</div>
                            <div className={styles.metricDesc}>Service packages purchased</div>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <span className={styles.metricLabel}>Pending Actions</span>
                            <div className={`${styles.metricIcon} ${styles.iconPurple}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                            </div>
                        </div>
                        <div>
                            <div className={styles.metricValue}>0</div>
                            <div className={styles.metricDesc}>Items requiring attention</div>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <span className={styles.metricLabel}>Success Place Rate</span>
                            <div className={`${styles.metricIcon} ${styles.iconBlue}`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                            </div>
                        </div>
                        <div>
                            <div className={styles.metricValueWithTrend}>
                                <div className={styles.metricValue}>100%</div>
                                <svg className={styles.trendIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 6l-9.5 9.5-5-5L1 18"></path><polyline points="17 6 23 6 23 12"></polyline></svg>
                            </div>
                            <div className={styles.metricDesc}>Application success rate</div>
                        </div>
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <h2 className={styles.sectionTitle}>Quick Actions</h2>
                    <div className={styles.actionList}>
                        <div className={styles.actionItem} onClick={openForm} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
                            <div className={styles.actionIconBox}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" /></svg>
                            </div>
                            <div className={styles.actionContent}>
                                <h4>Start Application — Green Card Renewal</h4>
                                <p>Continue with your purchased Advanced Plan package</p>
                            </div>
                        </div>

                        <div className={styles.actionItem}>
                            <div className={`${styles.actionIconBox} ${styles.blue}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg>
                            </div>
                            <div className={styles.actionContent}>
                                <h4>Complete Application</h4>
                                <p>Continue working on your existing application</p>
                            </div>
                        </div>

                        <div className={styles.actionItem}>
                            <div className={`${styles.actionIconBox} ${styles.green}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" /></svg>
                            </div>
                            <div className={styles.actionContent}>
                                <h4>View Documents</h4>
                                <p>Access your uploaded documents and files</p>
                            </div>
                        </div>

                        <div className={styles.actionItem}>
                            <div className={`${styles.actionIconBox} ${styles.teal}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                            </div>
                            <div className={styles.actionContent}>
                                <h4>Contact Support</h4>
                                <p>Get help from our immigration experts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.purchasesCard}>
                    <div className={styles.purchasesHeader}>
                        <div className={styles.purchasesIconBox}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                        </div>
                        <div>
                            <h2 className={styles.purchasesTitle}>Your Purchases</h2>
                            <p className={styles.purchasesDesc}>View and manage your immigration service purchases</p>
                        </div>
                    </div>

                    <div className={styles.purchaseItem}>
                        <div className={styles.purchaseItemTop}>
                            <span className={styles.purchaseName}>Green Card Renewal</span>
                            <span className={styles.purchasePrice}>$449.99</span>
                        </div>
                        <span className={styles.purchaseBadge}>Advanced Plan</span>
                    </div>
                </div>

                <div className={styles.statusCard}>
                    <h2 className={styles.sectionTitle}>Application Status</h2>
                    <div className={styles.statusTimeline}>
                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.done}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div className={styles.statusContent}>
                                <div className={styles.statusText}>
                                    <h4>Intake</h4>
                                    <p>Intake completed</p>
                                </div>
                                <span className={`${styles.statusBadge} ${styles.badgeDone}`}>Done</span>
                            </div>
                        </div>

                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.current}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                            </div>
                            <div className={styles.statusContent}>
                                <div className={styles.statusText}>
                                    <h4>In Progress</h4>
                                    <p>You are completing your application</p>
                                </div>
                                <span className={`${styles.statusBadge} ${styles.badgeCurrent}`}>Current</span>
                            </div>
                        </div>

                        <div className={styles.statusItem}>
                            <div className={`${styles.statusIcon} ${styles.upcoming}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m0 2v14h14V5H5m7 12l-5-5h3V7h4v5h3l-5 5Z" /></svg>
                            </div>
                            <div className={styles.statusContent}>
                                <div className={styles.statusText}>
                                    <h4>Submitted</h4>
                                    <p>Your application will be submitted for review</p>
                                </div>
                                <span className={`${styles.statusBadge} ${styles.badgeUpcoming}`}>Upcoming</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* navigation now opens a full page form at /dashboard/get-started */}

            <div className={styles.journeySection}>
                <h2 className={styles.journeyHeader}>Immigration Journey</h2>
                <div className={styles.journeyContent}>
                    <h3>Continue Your Immigration Journey with Horizon Pathways</h3>
                    <p>
                        Whether you're ready to remove the conditions on your Green Card, apply for U.S. citizenship, renew your Green Card, or
                        begin another immigration process, Horizon Pathways makes it easy to manage all your cases in one secure account.
                        Continue your immigration journey by adding your next application directly from your dashboard.
                    </p>
                    <button className={styles.journeyButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Start Your Next Application
                    </button>
                </div>
            </div>
        </div>
    );
}
