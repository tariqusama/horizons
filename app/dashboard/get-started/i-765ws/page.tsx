import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I765WSFormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 3</span>
                <span>33%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '33%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Form I-765 Worksheet (DACA) — USCIS Form I-765WS</h1>
            <p className={styles.pageSubtitle}>Answer every question about your financial situation. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Financial Information</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>My current annual income is: <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} placeholder="$" />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>My current annual expenses are: <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} placeholder="$" />
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
