import React from 'react';
import styles from './notifications.module.css';

export default function SupportTicketsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1>Support Tickets</h1>
                    <p>Manage your support requests</p>
                </div>
                <button className={styles.newTicketBtn}>
                    + New Ticket
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Total Tickets</span>
                        <svg className={`${styles.statIcon} ${styles.blue}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                    </div>
                    <div className={styles.statValue}>0</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Open</span>
                        <svg className={`${styles.statIcon} ${styles.blue}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div className={styles.statValue}>0</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>In Progress</span>
                        <svg className={`${styles.statIcon} ${styles.orange}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className={styles.statValue}>0</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statLabel}>Resolved</span>
                        <svg className={`${styles.statIcon} ${styles.green}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className={styles.statValue}>0</div>
                </div>
            </div>

            <div className={styles.ticketsSection}>
                <h2 className={styles.sectionTitle}>Your Tickets</h2>
                <p className={styles.sectionDesc}>View and manage your support tickets</p>
                
                <div className={styles.emptyState}>
                    <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <div className={styles.emptyText}>No tickets yet</div>
                    <button className={styles.createFirstBtn}>Create Your First Ticket</button>
                </div>
            </div>
        </div>
    );
}
