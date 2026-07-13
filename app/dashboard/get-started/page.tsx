"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./get-started.module.css";

export default function GetStartedPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("Hi, I think I selected the wrong package. Could you please help me pick the correct one?");
    const router = useRouter();

    const handleConfirm = () => {
        // Navigate to the next step
        router.push("/dashboard/get-started/i-90");
    };

    const handleWrongPackage = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSendMessage = () => {
        // Here you would handle sending the message
        setIsModalOpen(false);
        // Maybe show a success toast here
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.heroCard}>
                <div className={styles.heroText}>
                    <h1 className={styles.heroTitle}>Green Card Renewal / Replacement</h1>
                    <p className={styles.heroSubtitle}>Form I-90 with G-1145 e-Notification</p>
                </div>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.sectionTitleWrapper}>
                    <h2>Let's Begin Your Immigration Application.</h2>
                </div>
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Petitioner's Full Legal Name</span>
                        <div className={styles.infoCardValue}></div>
                    </div>
                    <div className={styles.infoCard}>
                        <span className={styles.infoCardLabel}>Beneficiary's Full Legal Name</span>
                        <div className={styles.infoCardValue}>Shehryarshafique04@Gmail.com</div>
                    </div>
                </div>
            </div>

            <div className={styles.confirmationCard}>
                <div className={styles.confirmationHeading}>
                    <h3>Application Confirmation</h3>
                </div>
                <p className={styles.confirmationText}>
                    Can you confirm this package is for renewing or replacing your existing Permanent Resident Card (Green Card)?
                </p>
                <p className={styles.noteText}>
                    This package includes: I-90, G-1145.
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
                            <button className={styles.modalButtonSend} onClick={handleSendMessage}>
                                Send to Case Manager
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
