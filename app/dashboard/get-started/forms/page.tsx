import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function GenericFormsPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Information</span>
                <span>50%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '50%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Complete Your Required Forms</h1>
            <p className={styles.pageSubtitle}>Our team is preparing the exact digital forms required for your specific immigration pathway. You will be notified when they are ready to fill out.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>NOTICE</div>
                <h2 className={styles.sectionHeading}>Forms Customization in Progress</h2>

                <div className={styles.formGrid}>
                    <p style={{ color: '#4A5568', padding: '20px 0' }}>
                        Your dedicated immigration professional is currently reviewing your account to assign the correct set of USCIS forms based on your unique case details. Please continue to the Document Upload section to provide your supporting evidence in the meantime.
                    </p>
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
