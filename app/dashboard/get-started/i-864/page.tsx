import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I864FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 10</span>
                <span>15%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '15%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Affidavit of Support Under Section 213A of the INA — USCIS Form I-864</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity as the sponsor, and the intending immigrants you are sponsoring. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Basis for Filing Affidavit of Support</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I, the sponsor, am: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="sponsorBasis" value="Petitioner" />
                                The petitioner. I filed or am filing for the immigration of my relative.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="sponsorBasis" value="Substitute" />
                                A substitute sponsor.
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="sponsorBasis" value="Joint" />
                                A joint sponsor.
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
