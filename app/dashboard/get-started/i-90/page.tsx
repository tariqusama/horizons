import React from 'react';
import Link from 'next/link';
import styles from './i90.module.css';

export default function I90FormPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topHeader}>
                <span>Question 1 of 12</span>
                <span>14%</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}></div>
            </div>

            <h1 className={styles.pageTitle}>Application to Replace Permanent Resident Card — USCIS Form I-90</h1>
            <p className={styles.pageSubtitle}>Answer every question about your identity, your current Permanent Resident Card, and the reason you are requesting a replacement. Your progress saves automatically.</p>

            <div className={styles.formSection}>
                <div className={styles.partLabel}>PART 1</div>
                <h2 className={styles.sectionHeading}>Information About You</h2>

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
                        <label className={styles.label}>Family Name (Last Name) <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Given Name (First Name) <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Middle Name</label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Have you ever used any other names (including maiden name / nicknames / aliases)? <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="otherNames" value="Yes" />
                                Yes
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="otherNames" value="No" />
                                No
                            </label>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Birth (mm/dd/yyyy) <span className={styles.required}>*</span></label>
                        <div className={styles.dateInputWrapper}>
                            <input type="text" placeholder="mm/dd/yyyy" className={styles.dateInput} />
                            <svg className={styles.calendarIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Country of Birth <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Country of Citizenship or Nationality <span className={styles.required}>*</span></label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>U.S. Social Security Number (if any)</label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroupFull}>
                        <label className={styles.label}>Gender <span className={styles.required}>*</span></label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="gender" value="Male" />
                                Male
                            </label>
                            <label className={styles.radioLabel}>
                                <input type="radio" name="gender" value="Female" />
                                Female
                            </label>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mother's First Name at Birth</label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Father's First Name at Birth</label>
                        <input type="text" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Class of Admission (from current Green Card)</label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Date of Admission as LPR (mm/dd/yyyy)</label>
                        <div className={styles.dateInputWrapper}>
                            <input type="text" placeholder="mm/dd/yyyy" className={styles.dateInput} />
                            <svg className={styles.calendarIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Port of Admission — City</label>
                        <input type="text" className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Port of Admission — State</label>
                        <input type="text" className={styles.input} />
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <button className={styles.btnPrev} disabled>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Previous
                    </button>
                    <Link href="/dashboard/get-started/g-1145" className={styles.btnNext}>
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
