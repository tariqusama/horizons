import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I765FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 11</span>
                <span>9%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '9%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application for Employment Authorization — USCIS Form I-765</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity and eligibility category to request an Employment Authorization Document (EAD). Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Reason for Applying</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am applying for: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Initial" />
                                Initial permission to accept employment.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Replacement" />
                                Replacement of lost, stolen, or damaged employment authorization document.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="reason" value="Renewal" />
                                Renewal of my permission to accept employment.
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
