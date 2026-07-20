import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I485FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 14</span>
                <span>8%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '8%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application to Register Permanent Residence or Adjust Status — USCIS Form I-485</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, immigration history, and eligibility to adjust status. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alien Registration Number (A-Number) (if any)</label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>USCIS Online Account Number (if any)</label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Current Legal Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Current Legal Given Name (First Name) <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Application Type or Filing Category</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am applying to register lawful permanent residence or adjust status because: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Family" />
                                Family-based (Immediate relative of a U.S. citizen, fiancé(e), etc.)
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Employment" />
                                Employment-based
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Special" />
                                Special Immigrant
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="category" value="Asylum" />
                                Asylum or Refugee
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
