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
    const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

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
        <div className={styles.pageWrapperDocUpload}>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className={styles.formSectionDocUpload}>
                <h1 className={styles.docUploadTitle}>Step 4: Document Upload</h1>
                
                <p className={styles.docUploadDesc}>
                    This is where you upload your required supporting documents. You can either upload a digital copy, or login to your account on a smart phone and take a picture of the document. If a document is not in English, we will translate it for you with a USCIS certified translator. <strong>REQUIRED documents are in BOLD</strong>
                </p>

                <div className={styles.progressSectionDocUpload}>
                    <div className={styles.progressHeaderDocUpload}>
                        You have uploaded <span className={styles.progressHighlight}>{uploadedRequiredCount}/{totalRequired}</span> required supporting documents.
                    </div>
                    <div className={styles.progressBarContainerDocUpload}>
                        <div className={styles.progressBarDocUpload} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                        Please upload all <strong>*Required</strong> documents before continuing.
                    </div>
                )}

                {checklist.groups.map((group, gIdx) => {
                    const groupRequiredCount = group.items.filter(i => i.required).length;
                    const isExpanded = expandedGroup === gIdx;
                    return (
                        <div key={gIdx} className={styles.uploadGroupDocUpload}>
                            <button 
                                className={styles.uploadGroupHeaderDocUpload}
                                onClick={() => setExpandedGroup(isExpanded ? null : gIdx)}
                            >
                                <span>{group.header} <span className={styles.uploadGroupHeaderCount}>{groupRequiredCount} required documents</span></span>
                                <span className={styles.uploadGroupHeaderIcon}>{isExpanded ? '-' : '+'}</span>
                            </button>
                            
                            {isExpanded && (
                                <div className={styles.uploadGroupContentDocUpload}>
                                    {group.items.map((item) => {
                                        const isUploaded = !!uploads[item.key];
                                        return (
                                            <div key={item.key} className={styles.uploadRow}>
                                                <div className={styles.uploadInfo}>
                                                    {getIcon(isUploaded)}
                                                    <span className={`${styles.uploadText} ${item.required ? styles.uploadTextBold : ''}`}>
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
                            )}
                        </div>
                    );
                })}

                <div className={styles.footerScreenshotDocUpload}>
                    <button onClick={() => { const prev = getPrevFormPath('/dashboard/get-started/document-upload', applicationTitle); router.push(prev); }} className={styles.btnActionDocUpload}>
                        &#8592; Previous
                    </button>
                    <button onClick={handleNext} className={styles.btnActionDocUpload}>
                        Continue
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
