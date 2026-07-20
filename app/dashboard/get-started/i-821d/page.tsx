import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I821DFormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 8</span>
                <span>12%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '12%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Consideration of Deferred Action for Childhood Arrivals — USCIS Form I-821D</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, travel history, and eligibility for DACA. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am not in immigration detention and I have included Form I-765 and I-765WS: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}><input type="radio" name="detention" value="Yes" /> Yes</label>
                        </div>
                    </div>
                    
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am applying for: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="dacaType" value="Initial" />
                                Initial Request
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="dacaType" value="Renewal" />
                                Renewal Request
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formActions}>
                <button className={styles.btnSecondary}>Save Draft</button>
                <div className={styles.rightActions}>
                    <button className={styles.btnOutline}>Back</button>
                    <Link href="/dashboard/get-started/document-upload" className={styles.btnPrimary}>Continue</Link>
                </div>
            </div>
        </div>
    );
}
