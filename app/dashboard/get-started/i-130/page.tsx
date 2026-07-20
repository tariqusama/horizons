import React from 'react';
import Link from 'next/link';
import styles from '../form.module.css';

export default function I130FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 12</span>
                <span>10%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar} style={{ width: '10%' }}></div>
            </div>

            <h1 className={styles.pageTitle}>Petition for Alien Relative — USCIS Form I-130</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity and your relationship to the relative you are petitioning for. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Relationship</h2>

                <div className={styles.formGrid}>
                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>I am filing this petition for my: <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup} style={{ gap: '20px' }}>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Spouse" /> Spouse</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Parent" /> Parent</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Brother/Sister" /> Brother/Sister</label>
                            <label className={styles.radioLabel}><input type="radio" name="relationship" value="Child" /> Child</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 2</div>
                <h2 className={styles.sectionHeading}>Information About You (Petitioner)</h2>

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
                        <label className={styles.label}>Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Given Name (First Name) <span className={styles.required}>*</span></label>
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
