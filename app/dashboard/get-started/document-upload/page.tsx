import React from 'react';
import Link from 'next/link';
import styles from './upload.module.css';

export default function DocumentUploadPage() {
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.formSection}>
                <h1 className={styles.pageTitle}>Document Upload</h1>
                <p className={styles.pageSubtitle}>Upload the documents required to replace your Permanent Resident Card (Green Card).</p>
                <p className={styles.pageDesc}>The exact evidence depends on your reason for filing (lost/stolen, expired, name change, etc.).</p>

                <div className={styles.alertBox}>
                    <p className={styles.alertTitle}>Need document translation?</p>
                    <p className={styles.alertDesc}>Any document not in English must be accompanied by a full English translation certified by the translator.</p>
                </div>

                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <span>Your uploads progress</span>
                        <span>0% complete</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar}></div>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Identity & Status</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Clear copy (front and back) of your current or expired Permanent Resident Card, if you still have it <span className={styles.requiredText}>*Required</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Government issued photo ID (driver's license, state ID, or passport biographic page) <span className={styles.requiredText}>*Required</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Birth certificate (with certified English translation if applicable) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>If Card Was Lost, Stolen, or Destroyed</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Copy of the police report filed for the lost or stolen card (recommended, not always required) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Signed statement describing when and how the card was lost, stolen, or destroyed <span className={styles.requiredText}>*Required</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>If Name or Biographic Data Changed</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Marriage certificate (for name change due to marriage) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Divorce decree (for name change due to divorce) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Court order legally changing your name <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Commuter Status / Automatic Conversion (if applicable)</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Evidence of U.S. residence (lease, utility bills) if changing from commuter to resident status <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Copy of your prior edition Alien Registration Card, if replacing an older AR-3, AR-103, or I-151 <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Any Other Supporting Documents</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
                            <span className={styles.uploadText}>Any additional documents that support your reason for replacement <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button className={styles.btnUpload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            Upload
                        </button>
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <Link href="/dashboard/get-started/submission" className={styles.btnNext}>
                        Save and Continue
                    </Link>
                </div>
            </div>
        </div>
    );
}
