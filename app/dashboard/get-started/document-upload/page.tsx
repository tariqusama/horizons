"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../form.module.css';

export default function DocumentUploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeDocType, setActiveDocType] = useState<string | null>(null);
    const [fileNames, setFileNames] = useState<Record<string, string>>({});
    
    // Simulate upload state for each document type
    const [uploads, setUploads] = useState<Record<string, boolean>>({
        prCard: false,
        photoId: false,
        birthCert: false,
        policeReport: false,
        statement: false,
        marriageCert: false,
        divorceDecree: false,
        courtOrder: false,
        residenceEvidence: false,
        priorCard: false,
        otherDocs: false
    });

    const [error, setError] = useState(false);

    // Calculate progress
    const totalRequired = 3; // prCard, photoId, statement (as an example of required docs from the UI)
    const uploadedRequired = (uploads.prCard ? 1 : 0) + (uploads.photoId ? 1 : 0) + (uploads.statement ? 1 : 0);
    const progress = Math.round((uploadedRequired / totalRequired) * 100);

    const handleUploadClick = (docType: string) => {
        setActiveDocType(docType);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeDocType) {
            const file = e.target.files[0];
            setUploads(prev => ({ ...prev, [activeDocType]: true }));
            setFileNames(prev => ({ ...prev, [activeDocType]: file.name }));
            if (error) setError(false);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Validate required documents
        if (!uploads.prCard || !uploads.photoId || !uploads.statement) {
            setError(true);
            return;
        }
        
        router.push('/dashboard/get-started/submission');
    };

    const getIcon = (isUploaded: boolean) => (
        isUploaded 
            ? <svg className={styles.statusIcon} style={{ color: '#10b981' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            : <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
    );

    return (
        <div className={styles.pageWrapper}>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png"
            />
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
                        <span>{progress}% complete</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar} style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>
                
                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                        Please upload all <strong>*Required</strong> documents before continuing.
                    </div>
                )}

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Identity & Status</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.prCard)}
                            <span className={styles.uploadText}>Clear copy (front and back) of your current or expired Permanent Resident Card, if you still have it <span className={styles.requiredText} style={{ color: error && !uploads.prCard ? '#ef4444' : '' }}>*Required</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('prCard')} className={styles.btnUpload} style={{ backgroundColor: uploads.prCard ? '#f3f4f6' : '', color: uploads.prCard ? '#10b981' : '' }}>
                            {uploads.prCard ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.photoId)}
                            <span className={styles.uploadText}>Government issued photo ID (driver's license, state ID, or passport biographic page) <span className={styles.requiredText} style={{ color: error && !uploads.photoId ? '#ef4444' : '' }}>*Required</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('photoId')} className={styles.btnUpload} style={{ backgroundColor: uploads.photoId ? '#f3f4f6' : '', color: uploads.photoId ? '#10b981' : '' }}>
                            {uploads.photoId ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.birthCert)}
                            <span className={styles.uploadText}>Birth certificate (with certified English translation if applicable) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('birthCert')} className={styles.btnUpload} style={{ backgroundColor: uploads.birthCert ? '#f3f4f6' : '', color: uploads.birthCert ? '#10b981' : '' }}>
                            {uploads.birthCert ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>If Card Was Lost, Stolen, or Destroyed</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.policeReport)}
                            <span className={styles.uploadText}>Copy of the police report filed for the lost or stolen card (recommended, not always required) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('policeReport')} className={styles.btnUpload} style={{ backgroundColor: uploads.policeReport ? '#f3f4f6' : '', color: uploads.policeReport ? '#10b981' : '' }}>
                            {uploads.policeReport ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.statement)}
                            <span className={styles.uploadText}>Signed statement describing when and how the card was lost, stolen, or destroyed <span className={styles.requiredText} style={{ color: error && !uploads.statement ? '#ef4444' : '' }}>*Required</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('statement')} className={styles.btnUpload} style={{ backgroundColor: uploads.statement ? '#f3f4f6' : '', color: uploads.statement ? '#10b981' : '' }}>
                            {uploads.statement ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>If Name or Biographic Data Changed</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.marriageCert)}
                            <span className={styles.uploadText}>Marriage certificate (for name change due to marriage) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('marriageCert')} className={styles.btnUpload} style={{ backgroundColor: uploads.marriageCert ? '#f3f4f6' : '', color: uploads.marriageCert ? '#10b981' : '' }}>
                            {uploads.marriageCert ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.divorceDecree)}
                            <span className={styles.uploadText}>Divorce decree (for name change due to divorce) <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('divorceDecree')} className={styles.btnUpload} style={{ backgroundColor: uploads.divorceDecree ? '#f3f4f6' : '', color: uploads.divorceDecree ? '#10b981' : '' }}>
                            {uploads.divorceDecree ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.courtOrder)}
                            <span className={styles.uploadText}>Court order legally changing your name <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('courtOrder')} className={styles.btnUpload} style={{ backgroundColor: uploads.courtOrder ? '#f3f4f6' : '', color: uploads.courtOrder ? '#10b981' : '' }}>
                            {uploads.courtOrder ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Commuter Status / Automatic Conversion (if applicable)</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.residenceEvidence)}
                            <span className={styles.uploadText}>Evidence of U.S. residence (lease, utility bills) if changing from commuter to resident status <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('residenceEvidence')} className={styles.btnUpload} style={{ backgroundColor: uploads.residenceEvidence ? '#f3f4f6' : '', color: uploads.residenceEvidence ? '#10b981' : '' }}>
                            {uploads.residenceEvidence ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.priorCard)}
                            <span className={styles.uploadText}>Copy of your prior edition Alien Registration Card, if replacing an older AR-3, AR-103, or I-151 <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('priorCard')} className={styles.btnUpload} style={{ backgroundColor: uploads.priorCard ? '#f3f4f6' : '', color: uploads.priorCard ? '#10b981' : '' }}>
                            {uploads.priorCard ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>

                <div className={styles.uploadGroup}>
                    <div className={styles.uploadGroupHeader}>Any Other Supporting Documents</div>
                    <div className={styles.uploadRow}>
                        <div className={styles.uploadInfo}>
                            {getIcon(uploads.otherDocs)}
                            <span className={styles.uploadText}>Any additional documents that support your reason for replacement <span className={styles.optionalText}>(optional)</span></span>
                        </div>
                        <button onClick={() => handleUploadClick('otherDocs')} className={styles.btnUpload} style={{ backgroundColor: uploads.otherDocs ? '#f3f4f6' : '', color: uploads.otherDocs ? '#10b981' : '' }}>
                            {uploads.otherDocs ? 'Uploaded' : 'Upload'}
                        </button>
                    </div>
                </div>

                <div className={styles.footerActions}>
                    <button onClick={handleNext} className={styles.btnNext} style={{ border: 'none', cursor: 'pointer', width: '100%', maxWidth: '300px' }}>
                        Save and Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
