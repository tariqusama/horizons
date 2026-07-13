import React from 'react';
import Link from 'next/link';
import styles from './g1145.module.css';

export default function G1145FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 4</span>
                <span>25%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}></div>
            </div>

            <h1 className={styles.pageTitle}>e-Notification of Application/Petition Acceptance — USCIS Form G-1145</h1>
            <p className={styles.pageSubtitle}>Provide the applicant/petitioner's contact details so USCIS can send electronic notifications when they accept the application.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>APPLICANT / PETITIONER INFORMATION</div>
                <h2 className={styles.sectionHeading}>Applicant / Petitioner Information</h2>
                <p className={styles.sectionDesc}>This information must match exactly what appears on the main petition or application you're filing with G-1145.</p>

                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Applicant / Petitioner Full Last Name <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Applicant / Petitioner Full First Name <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Applicant / Petitioner Full Middle Name</label>
                        <input type="text" className={styles.input} />
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <Link href="/dashboard/get-started/i-90" className={styles.btnPrev}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Previous
                    </Link>
                    <Link href="/dashboard/get-started/document-upload" className={styles.btnNext}>
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
