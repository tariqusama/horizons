'use client';
import React, { useEffect, useState } from 'react';
import styles from './purchases.module.css';
import api from '@/lib/api';

interface Purchase {
    id: number;
    title: string;
    subtitle: string;
    amount: number;
    paid_amount: number;
    created_at: string;
}

function formatDate(dateString: string) {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getPlanTier(subtitle: string) {
    const s = (subtitle || '').toLowerCase();
    if (s.includes('premium')) return 'Premium Plan';
    if (s.includes('advanced')) return 'Advanced Plan';
    if (s.includes('basic')) return 'Basic Plan';
    return subtitle.replace('Plan: ', '') || 'Standard Plan';
}

function getFeatures(subtitle: string) {
    const s = (subtitle || '').toLowerCase();
    if (s.includes('premium')) {
        return [
            'Everything in Advanced Plan',
            '30-minute 1-on-1 attorney consultation',
            'USCIS Interview preparation kit',
            'Priority email support',
        ];
    }
    if (s.includes('advanced')) {
        return [
            'Everything in Basic Plan',
            'Certified translation services',
            'Legal review by an immigration attorney',
            'Priority support with 24-hour response time',
            'Phone support for real-time assistance',
        ];
    }
    return [
        'Complete form preparation and review',
        'Dedicated case manager',
        'Step-by-step guidance',
        '100% satisfaction guarantee',
    ];
}

export default function PurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                const apps: Purchase[] = res.data || [];
                // Only show applications owned by the user (user_id check handled server-side)
                setPurchases(apps);
            })
            .catch(err => console.error('Failed to load purchases:', err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Purchase History</h1>
                    <p>View all your service purchases</p>
                </div>
                <p style={{ color: '#6B7280', padding: '24px 0' }}>Loading purchases...</p>
            </div>
        );
    }

    if (purchases.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Purchase History</h1>
                    <p>View all your service purchases</p>
                </div>
                <div className={styles.purchaseCard} style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <p style={{ color: '#6B7280', fontSize: '15px' }}>You have no purchases yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Purchase History</h1>
                <p>View all your service purchases</p>
            </div>

            {purchases.map((app) => {
                const totalAmount = Number(app.amount || 0);
                const paidAmt = Number(app.paid_amount || 0);
                const isPaid = totalAmount > 0 && paidAmt >= totalAmount;
                const isPending = totalAmount === 0 || paidAmt < totalAmount;
                const features = getFeatures(app.subtitle);
                const planTier = getPlanTier(app.subtitle);

                return (
                    <div key={app.id} className={styles.purchaseCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.titleSection}>
                                <h2>{app.title}</h2>
                                <p>Purchased on {formatDate(app.created_at)}</p>
                            </div>
                            <div className={styles.priceSection}>
                                <div className={styles.price}>
                                    {totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : '--'}
                                </div>
                                <span
                                    className={styles.statusBadge}
                                    style={{
                                        backgroundColor: isPaid ? '#D1FAE5' : '#FEE2E2',
                                        color: isPaid ? '#065F46' : '#991B1B',
                                    }}
                                >
                                    {isPaid ? 'Paid' : 'Payment Pending'}
                                </span>
                            </div>
                        </div>

                        <div className={styles.planTier}>
                            <span className={styles.planTierLabel}>Plan Tier:</span>
                            <span className={styles.planTierBadge}>{planTier}</span>
                        </div>

                        {isPending && totalAmount > 0 && (
                            <div style={{
                                margin: '0 24px 16px',
                                padding: '12px 16px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FCA5A5',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <p style={{ color: '#B91C1C', fontSize: '13px', margin: 0 }}>
                                    Payment of <strong>${(totalAmount - paidAmt).toFixed(2)}</strong> is still pending. Please complete your payment to proceed.
                                </p>
                            </div>
                        )}

                        <div className={styles.featuresSection}>
                            <h3>Features:</h3>
                            <div className={styles.featuresGrid}>
                                {features.map((feature, idx) => (
                                    <div key={idx} className={styles.featureItem}>
                                        <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
