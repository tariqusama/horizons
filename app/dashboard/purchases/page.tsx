import React from 'react';
import styles from './purchases.module.css';

export default function PurchasesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Purchase History</h1>
                <p>View all your service purchases</p>
            </div>

            <div className={styles.purchaseCard}>
                <div className={styles.cardTop}>
                    <div className={styles.titleSection}>
                        <h2>Green Card Renewal</h2>
                        <p>Purchased on July 13, 2026</p>
                    </div>
                    <div className={styles.priceSection}>
                        <div className={styles.price}>$449.99</div>
                        <span className={styles.statusBadge}>paid</span>
                    </div>
                </div>

                <div className={styles.planTier}>
                    <span className={styles.planTierLabel}>Plan Tier:</span>
                    <span className={styles.planTierBadge}>Advanced Plan</span>
                </div>

                <div className={styles.featuresSection}>
                    <h3>Features:</h3>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureItem}>
                            <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Everything in Basic Plan
                        </div>
                        <div className={styles.featureItem}>
                            <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Certified translation services
                        </div>
                        <div className={styles.featureItem}>
                            <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Legal review by an immigration attorney
                        </div>
                        <div className={styles.featureItem}>
                            <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Priority support with 24-hour response time
                        </div>
                        <div className={styles.featureItem}>
                            <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            Phone support for real-time assistance
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
