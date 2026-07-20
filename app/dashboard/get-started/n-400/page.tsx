import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function N400FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 18</span>
                <span>5%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '5%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Application for Naturalization — USCIS Form N-400</h1>
            <p className={styles.pageSubtitle}>Answer every question about your eligibility, identity, and residence to apply for U.S. citizenship. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About Your Eligibility</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>You are at least 18 years of age and: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="5_years" />
                                Have been a lawful permanent resident of the United States for at least 5 years.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="3_years" />
                                Have been a lawful permanent resident of the United States for at least 3 years, AND have been married to and living with the same U.S. citizen spouse.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="eligibility" value="military" />
                                Are applying on the basis of qualifying military service.
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Information About You (Person Applying for Naturalization)</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Alien Registration Number (A-Number) <span className={styles.required}>*</span></label>
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

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Current Legal Middle Name</label>
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
