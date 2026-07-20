import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I130AFormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 5</span>
                <span>20%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '20%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Supplemental Information for Spouse Beneficiary — USCIS Form I-130A</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, employment, and residence history. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You (Spouse Beneficiary)</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alien Registration Number (A-Number) (if any)</label>
                        <input type="text" className={styles.input} />
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
