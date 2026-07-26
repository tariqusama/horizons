"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import styles from '../form.module.css';
import { getPrevFormPath } from '../formsHelper';
import { getChecklists } from '@/lib/api/cases';
import { generateFormChecklist, FormChecklist } from '@/lib/utils/documentHelper';

const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

function DocumentUploadContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [checklist, setChecklist] = useState<FormChecklist | null>(null);
    const [activeDocType, setActiveDocType] = useState<string | null>(null);
    const [fileNames, setFileNames] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [uploads, setUploads] = useState<Record<string, boolean>>({});
    const [error, setError] = useState(false);
    const [applicationTitle, setApplicationTitle] = useState('');
    const [applicationSubtitle, setApplicationSubtitle] = useState('');

    useEffect(() => {
        Promise.all([
            api.get('/applications'),
            getChecklists()
        ]).then(([appsRes, checklistsData]) => {
            const app = appsRes.data && appsRes.data[0] ? appsRes.data[0] : null;
            if (app) {
                setApplicationTitle(app.title || '');
                setApplicationSubtitle(app.subtitle || '');
            }
            
            const generated = generateFormChecklist(app, checklistsData);
            if (generated) {
                setChecklist(generated);
            } else {
                setChecklist({
                    title: "Document Upload",
                    subtitle: "Upload required supporting evidence.",
                    requiredKeys: [],
                    groups: []
                });
            }
        }).catch(() => { });
    }, [searchParams]);

    useEffect(() => {
        api.get('/documents')
            .then(res => {
                if (Array.isArray(res.data)) {
                    res.data.forEach((doc: any) => {
                        if (doc.status === 'Uploaded' || doc.file_path) {
                            const key = sanitize(doc.name);
                            setUploads(prev => ({ ...prev, [key]: true }));
                            if (doc.file_path) {
                                const filename = doc.file_path.split('/').pop() || 'Uploaded file';
                                setFileNames(prev => ({ ...prev, [key]: filename }));
                            }
                        }
                    });
                }
            })
            .catch(() => { });
    }, []);

    const totalRequired = checklist ? checklist.requiredKeys.length : 0;
    const uploadedRequiredCount = checklist ? checklist.requiredKeys.filter(k => uploads[k]).length : 0;
    const progress = totalRequired > 0 ? Math.round((uploadedRequiredCount / totalRequired) * 100) : 100;

    const handleUploadClick = (docKey: string) => {
        setActiveDocType(docKey);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeDocType) {
            const file = e.target.files[0];
            const currentDocKey = activeDocType;
            setIsUploading(currentDocKey);
            
            let originalName = currentDocKey;
            if (checklist) {
                for (const group of checklist.groups) {
                    const found = group.items.find(i => i.key === currentDocKey);
                    if (found) {
                        originalName = found.label;
                        break;
                    }
                }
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('doc_type', currentDocKey);
            formData.append('name', originalName);

            try {
                await api.post('/documents/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setUploads(prev => ({ ...prev, [currentDocKey]: true }));
                setFileNames(prev => ({ ...prev, [currentDocKey]: file.name }));
                if (error) setError(false);
            } catch (err) {
                console.error("Document upload failed", err);
                alert("Upload failed. Max file size is 10MB (PDF, JPG, PNG).");
            } finally {
                setIsUploading(null);
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        const missingRequired = checklist ? checklist.requiredKeys.some(k => !uploads[k]) : false;
        if (missingRequired) {
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

    if (!checklist) return <div className="p-10 text-center">Loading checklist...</div>;

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
                <h1 className={styles.pageTitle}>{applicationTitle || checklist.title}</h1>
                {applicationSubtitle && (
                    <p className={styles.pageSubtitle} style={{ fontWeight: 600, color: '#FA6514', marginBottom: '4px' }}>{applicationSubtitle}</p>
                )}
                <p className={styles.pageSubtitle}>{checklist.subtitle}</p>

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

                {checklist.groups.map((group, gIdx) => (
                    <div key={gIdx} className={styles.uploadGroup}>
                        <div className={styles.uploadGroupHeader}>{group.header}</div>
                        {group.items.map((item) => {
                            const isUploaded = !!uploads[item.key];
                            return (
                                <div key={item.key} className={styles.uploadRow}>
                                    <div className={styles.uploadInfo}>
                                        {getIcon(isUploaded)}
                                        <span className={styles.uploadText}>
                                            {item.label}{' '}
                                            {item.required ? (
                                                <span className={styles.requiredText} style={{ color: error && !isUploaded ? '#ef4444' : '' }}>
                                                    Required
                                                </span>
                                            ) : (
                                                <span className={styles.optionalText}>Optional</span>
                                            )}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleUploadClick(item.key)}
                                        disabled={isUploading === item.key}
                                        className={styles.btnUpload}
                                        style={{ backgroundColor: isUploaded ? '#f3f4f6' : '', color: isUploaded ? '#10b981' : '' }}
                                    >
                                        {isUploading === item.key ? 'Uploading...' : (isUploaded ? 'Uploaded' : 'Upload')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ))}

                <div className={styles.footerScreenshot}>
                    <button onClick={() => { const prev = getPrevFormPath('/dashboard/get-started/document-upload', applicationTitle); router.push(prev); }} className={styles.btnTeal}>
                        &#8592; Previous
                    </button>
                    <button onClick={handleNext} className={styles.btnTeal}>
                        Save and Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DocumentUploadPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading document checklist...</div>}>
            <DocumentUploadContent />
        </Suspense>
    );
}
