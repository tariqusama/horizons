"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./get-started.module.css";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function GetStartedPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [message, setMessage] = useState("Hi, I think I selected the wrong package. Could you please help me pick the correct one?");
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [application, setApplication] = useState<any>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await api.get('/applications');
                const apps = res.data || [];
                const latest = apps[0];
                if (!latest) {
                    router.push('/dashboard');
                    return;
                }
                const pendingBalance = (Number(latest.amount || 0) - Number(latest.paid_amount || 0));
                if (pendingBalance > 0 || latest.status === 'Pending') {
                    router.push('/dashboard');
                    return;
                }
                setApplication(latest);
            } catch (error) {
                console.error(error);
                router.push('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        checkStatus();
    }, [router]);

    const handleConfirm = () => {
        let targetRoute = "/dashboard/get-started/i-90"; // default fallback

        if (application?.title) {
            const title = application.title.toLowerCase();
            if (title.includes('n-400') || title.includes('naturalization') || title.includes('citizenship')) {
                targetRoute = "/dashboard/get-started/n-400";
            } else if (title.includes('fiancé') || title.includes('fiance') || title.includes('spouse') || title.includes('relative')) {
                targetRoute = "/dashboard/get-started/i-130";
            } else if (title.includes('daca') || title.includes('821d')) {
                targetRoute = "/dashboard/get-started/i-821d";
            } else if (title.includes('replace') || title.includes('fix') || title.includes('green card') || title.includes('i-90')) {
                targetRoute = "/dashboard/get-started/i-90";
            }
        }
        
        router.push(targetRoute);
    };

    const handleWrongPackage = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        try {
            await api.post('/messages', { message: message.trim() });
            setIsModalOpen(false);
            setMessage(""); // Clear message
            localStorage.setItem('wrong_package_reported', 'true');
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.pageWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <p style={{ color: '#5B6472', fontWeight: 600 }}>Loading...</p>
            </div>
        );
    }

    const getPackageDescription = () => {
        if (!application?.title) return "renewing or replacing your existing Permanent Resident Card (Green Card)";
        const title = application.title.toLowerCase();
        if (title.includes('n-400') || title.includes('naturalization') || title.includes('citizenship')) return "your US Naturalization / Citizenship";
        if (title.includes('fiancé') || title.includes('fiance') || title.includes('spouse') || title.includes('relative')) return "bringing a fiancé(e), spouse, or relative to the U.S.";
        if (title.includes('daca') || title.includes('821d')) return "your DACA (Deferred Action for Childhood Arrivals)";
        return "renewing or replacing your existing Permanent Resident Card (Green Card)";
    };

    const getIncludedForms = () => {
        if (!application?.title) return "I-90, G-1145";
        const title = application.title.toLowerCase();
        if (title.includes('n-400') || title.includes('naturalization') || title.includes('citizenship')) return "N-400, G-1145";
        if (title.includes('fiancé') || title.includes('fiance') || title.includes('spouse') || title.includes('relative')) return "I-130, I-130A, G-1145";
        if (title.includes('daca') || title.includes('821d')) return "I-821D, I-765, I-765WS, G-1145";
        return "I-90, G-1145";
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.heroCard}>
                <div className={styles.heroText}>
                    <h1 className={styles.heroTitle}>{application?.title || 'Green Card Renewal / Replacement'}</h1>
                    <p className={styles.heroSubtitle}>{application?.package_name || `Form ${getIncludedForms().split(',')[0]} with G-1145 e-Notification`}</p>
                </div>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.sectionTitleWrapper}>
                    <h2>Let's Begin Your Immigration Application.</h2>
                </div>
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Petitioner's Full Legal Name</span>
                        <div className={styles.infoCardValue}>{user?.name || 'Pending'}</div>
                    </div>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Beneficiary's Full Legal Name</span>
                        <div className={styles.infoCardValue}>To be provided</div>
                    </div>
                </div>
            </div>

            <div className={styles.confirmationCard}>
                <div className={styles.confirmationHeading}>
                    <h3>Application Confirmation</h3>
                </div>
                <p className={styles.confirmationText}>
                    Can you confirm this package is for {getPackageDescription()}?
                </p>
                <p className={styles.noteText}>
                    This package includes: {getIncludedForms()}.
                </p>
                <div className={styles.buttonRow}>
                    <button className={styles.buttonPrimary} onClick={handleConfirm}>
                        ✓ Yes, I can confirm
                    </button>
                    <button className={styles.buttonSecondary} onClick={handleWrongPackage}>
                        ✕ No, I selected the wrong package
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Message your Case Manager</h3>
                            <button className={styles.modalClose} onClick={closeModal}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <p className={styles.modalDescription}>
                            Tell your Case Manager which package you think you should be on and any concern. They'll respond in your dashboard messages.
                        </p>
                        <textarea 
                            className={styles.modalTextarea}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.modalButtonCancel} onClick={closeModal}>
                                Cancel
                            </button>
                            <button className={styles.modalButtonSend} onClick={handleSendMessage} disabled={isSending}>
                                {isSending ? 'Sending...' : 'Send to Case Manager'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
                        <div style={{ backgroundColor: '#e2f5e9', color: '#16a34a', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3 className={styles.modalTitle} style={{ marginBottom: '0.5rem' }}>Message Sent!</h3>
                        <p className={styles.modalDescription}>
                            Your message was sent to your Case Manager successfully.
                        </p>
                        <div className={styles.modalActions} style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                            <button className={styles.modalButtonSend} onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/dashboard');
                            }} style={{ width: '100%' }}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
