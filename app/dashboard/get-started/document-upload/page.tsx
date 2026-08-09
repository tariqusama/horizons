"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import styles from '../form.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { getPrevFormPath } from '../formsHelper';
import { getChecklists } from '@/lib/api/cases';
import { generateFormChecklist, FormChecklist } from '@/lib/utils/documentHelper';
import { getStorageUrl } from '@/lib/api';

const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

/* ─── Upload Preview Modal ─── */
interface UploadModalProps {
    docLabel: string;
    docKey: string;
    existingFileName?: string;
    onClose: () => void;
    onUpload: (file: File) => void;
    isUploading: boolean;
}

function UploadModal({ docLabel, existingFileName, onClose, onUpload, isUploading }: UploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isPdf, setIsPdf] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        setSelectedFile(file);
        // Create blob URL for both images and PDFs
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setIsPdf(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    }, []);

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleConfirmUpload = () => {
        if (selectedFile) onUpload(selectedFile);
    };

    return (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.uploadModalContent}>
                {/* Header */}
                <div className={styles.uploadModalHeader}>
                    <div>
                        <h2 className={styles.uploadModalTitle}>{docLabel}</h2>
                        <p className={styles.uploadModalSubtitle}>Supporting document upload</p>
                    </div>
                    <button onClick={onClose} className={styles.uploadModalClose} aria-label="Close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className={styles.uploadModalBody}>
                    {/* Left: Preview */}
                    <div className={styles.uploadModalPreview}>
                        <div className={styles.previewBox}>
                            {previewUrl && isPdf ? (
                                <iframe
                                    src={previewUrl}
                                    className={styles.previewIframe}
                                    title="PDF Preview"
                                />
                            ) : previewUrl && !isPdf ? (
                                <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                            ) : (
                                <div className={styles.previewEmpty}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>Select a file to preview it here</span>
                                </div>
                            )}
                        </div>
                        {selectedFile && (
                            <p className={styles.previewFileInfo}>
                                {selectedFile.name} &nbsp;·&nbsp; {(selectedFile.size / 1024).toFixed(0)} KB
                            </p>
                        )}
                        {existingFileName && !selectedFile && (
                            <p className={styles.previewFileInfo}>Current file: {existingFileName}</p>
                        )}
                    </div>

                    {/* Right: Upload area */}
                    <div className={styles.uploadModalRight}>
                        <div
                            className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F0501A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                            </svg>
                            <p className={styles.dropZoneText}>Drag and Drop file here or upload from:</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
                                onChange={handleInputChange}
                            />
                            <button
                                className={styles.btnUploadSource}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                Computer
                            </button>
                            <p className={styles.dropZoneFormats}>Files Supported: JPG, JPEG, PNG, PDF, TIF</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.uploadModalFooter}>
                    <button onClick={onClose} className={styles.btnModalCancel}>Cancel</button>
                    <button
                        onClick={handleConfirmUpload}
                        disabled={!selectedFile || isUploading}
                        className={styles.btnModalUpload}
                    >
                        {isUploading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Uploading...
                            </>
                        ) : existingFileName ? 'Update Document' : 'Upload Document'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
function DocumentUploadContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [checklist, setChecklist] = useState<FormChecklist | null>(null);
    const [fileNames, setFileNames] = useState<Record<string, string>>({});
    const [filePaths, setFilePaths] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [uploads, setUploads] = useState<Record<string, boolean>>({});
    const [docIds, setDocIds] = useState<Record<string, number>>({});
    const [error, setError] = useState(false);
    const [applicationTitle, setApplicationTitle] = useState('');
    const [application, setApplication] = useState<any>(null);
    const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
    const [modalDoc, setModalDoc] = useState<{ key: string; label: string } | null>(null);
    const [activeHint, setActiveHint] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([api.get('/applications'), getChecklists()])
            .then(([appsRes, checklistsData]) => {
                const app = appsRes.data?.[0] ?? null;
                if (app) {
                    setApplicationTitle(app.title || '');
                    setApplication(app);
                    
                    let userRole = 'petitioner';
                    if (app.user_id !== user?.id) {
                        const participant = app.participants?.find((p: any) => p.user_id === user?.id);
                        if (participant) {
                            userRole = participant.role;
                        }
                    }

                    const generated = generateFormChecklist(app, checklistsData, userRole);
                    setChecklist(generated ?? { title: "Document Upload", subtitle: "", requiredKeys: [], groups: [] });
                }
            }).catch(() => { });
    }, [searchParams, user]);

    useEffect(() => {
        api.get('/documents').then(res => {
            if (Array.isArray(res.data)) {
                res.data.forEach((doc: any) => {
                    if (doc.status === 'Uploaded' || doc.file_path) {
                        const key = sanitize(doc.name);
                        setUploads(prev => ({ ...prev, [key]: true }));
                        setDocIds(prev => ({ ...prev, [key]: doc.id }));
                        if (doc.file_path) {
                            const filename = doc.file_path.split('/').pop() || 'Uploaded file';
                            setFileNames(prev => ({ ...prev, [key]: filename }));
                            setFilePaths(prev => ({ ...prev, [key]: doc.file_path }));
                        }
                    }
                });
            }
        }).catch(() => { });
    }, []);

    const totalRequired = checklist?.requiredKeys.length ?? 0;
    const uploadedRequiredCount = checklist?.requiredKeys.filter(k => uploads[k]).length ?? 0;
    const progress = totalRequired > 0 ? Math.round((uploadedRequiredCount / totalRequired) * 100) : 100;

    const handleOpenModal = (key: string, label: string) => setModalDoc({ key, label });
    const handleCloseModal = () => setModalDoc(null);

    const handleUploadFile = async (file: File) => {
        if (!modalDoc) return;
        const { key: currentDocKey, label } = modalDoc;
        setIsUploading(currentDocKey);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('doc_type', currentDocKey);
        formData.append('name', label);

        try {
            const res = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newId = res.data?.id || res.data?.document?.id;
            const newPath = res.data?.file_path || res.data?.document?.file_path;
            setUploads(prev => ({ ...prev, [currentDocKey]: true }));
            setFileNames(prev => ({ ...prev, [currentDocKey]: file.name }));
            if (newPath) setFilePaths(prev => ({ ...prev, [currentDocKey]: newPath }));
            if (newId) setDocIds(prev => ({ ...prev, [currentDocKey]: newId }));
            if (error) setError(false);
            handleCloseModal();
        } catch (err) {
            alert("Upload failed. Max file size is 10MB (PDF, JPG, PNG).");
        } finally {
            setIsUploading(null);
        }
    };

    const handleDeleteDoc = async (docKey: string) => {
        const docId = docIds[docKey];
        try {
            if (docId) await api.delete(`/documents/${docId}`);
            setUploads(prev => { const n = { ...prev }; delete n[docKey]; return n; });
            setFileNames(prev => { const n = { ...prev }; delete n[docKey]; return n; });
            setFilePaths(prev => { const n = { ...prev }; delete n[docKey]; return n; });
            setDocIds(prev => { const n = { ...prev }; delete n[docKey]; return n; });
        } catch {
            alert('Failed to delete document. Please try again.');
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (checklist?.requiredKeys.some(k => !uploads[k])) { setError(true); return; }
        router.push('/dashboard/get-started/submission');
    };

    const getIcon = (isUploaded: boolean) => (
        isUploaded
            ? <svg className={styles.statusIcon} style={{ color: '#F0501A' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            : <svg className={styles.statusIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
    );

    if (!checklist) return <div className="p-10 text-center">Loading checklist...</div>;

    return (
        <div className={styles.pageWrapperDocUpload}>
            {/* Preview/Upload Modal */}
            {modalDoc && (
                <UploadModal
                    docLabel={modalDoc.label}
                    docKey={modalDoc.key}
                    existingFileName={fileNames[modalDoc.key]}
                    onClose={handleCloseModal}
                    onUpload={handleUploadFile}
                    isUploading={isUploading === modalDoc.key}
                />
            )}

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
                        <div className={styles.progressBarDocUpload} style={{ width: `${progress}%` }} />
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
                            <button className={styles.uploadGroupHeaderDocUpload} onClick={() => setExpandedGroup(isExpanded ? null : gIdx)}>
                                <span>{group.header} <span className={styles.uploadGroupHeaderCount}>{groupRequiredCount} required documents</span></span>
                                <span className={styles.uploadGroupHeaderIcon}>{isExpanded ? '−' : '+'}</span>
                            </button>

                            {isExpanded && (
                                <div className={styles.uploadGroupContentDocUpload}>
                                    {group.items.map((item) => {
                                        const isUploaded = !!uploads[item.key];
                                        return (
                                            <div key={item.key} className={styles.uploadRow}>
                                                <div className={styles.uploadInfo}>
                                                    {getIcon(isUploaded)}
                                                    <div>
                                                        <span className={`${styles.uploadText} ${item.required ? styles.uploadTextBold : ''}`}>
                                                            {item.label}{' '}
                                                            {item.required
                                                                ? <span className={styles.requiredText} style={{ color: error && !isUploaded ? '#ef4444' : '' }}>Required</span>
                                                                : <span className={styles.optionalText}>Optional</span>
                                                            }
                                                        </span>
                                                        {item.hint && (
                                                            <div style={{ marginTop: '4px' }}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setActiveHint(activeHint === item.key ? null : item.key)}
                                                                    style={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                        fontSize: '11px', color: '#2563eb', background: 'none',
                                                                        border: 'none', cursor: 'pointer', padding: '0', fontWeight: 500
                                                                    }}
                                                                >
                                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                                                    </svg>
                                                                    {activeHint === item.key ? 'Hide guide' : 'What to upload?'}
                                                                </button>
                                                                {activeHint === item.key && (
                                                                    <div style={{
                                                                        marginTop: '8px', padding: '10px 14px',
                                                                        background: '#eff6ff', border: '1px solid #bfdbfe',
                                                                        borderRadius: '8px', fontSize: '12.5px',
                                                                        color: '#1e40af', lineHeight: '1.6', maxWidth: '520px'
                                                                    }}>
                                                                        {item.hint}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {isUploaded && fileNames[item.key] && (
                                                            <div className={styles.uploadedFileName}>{fileNames[item.key]}</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={styles.uploadActions} style={{ display: 'flex', gap: '8px' }}>
                                                    {isUploaded ? (
                                                        <>
                                                            {filePaths[item.key] && (
                                                                <a 
                                                                    href={getStorageUrl(filePaths[item.key])} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className={styles.btnIconView} 
                                                                    title="View document"
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                                        <circle cx="12" cy="12" r="3" />
                                                                    </svg>
                                                                </a>
                                                            )}
                                                            <button onClick={() => handleOpenModal(item.key, item.label)} className={styles.btnIconUpdate} title="Update document">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                </svg>
                                                            </button>
                                                            <button onClick={() => handleDeleteDoc(item.key)} className={styles.btnIconDelete} title="Delete document">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6" />
                                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                    <path d="M10 11v6M14 11v6" />
                                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => handleOpenModal(item.key, item.label)} className={styles.btnIconUpload} title="Upload document">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="16 16 12 12 8 16" />
                                                                <line x1="12" y1="12" x2="12" y2="21" />
                                                                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className={styles.footerScreenshotDocUpload}>
                    <button 
                        type="button" 
                        className={styles.btnActionDocUpload}
                        onClick={() => router.push(getPrevFormPath('/dashboard/get-started/document-upload', application))}
                    >
                        ← Previous
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
