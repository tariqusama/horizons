'use client';
import React, { useEffect, useState, useRef } from "react";
import api, { getStorageUrl } from "@/lib/api";
import { getChecklists } from '@/lib/api/cases';
import { Document, resolveDocuments, defaultChecklist, isMatch, getChecklistKeyFromService } from '@/lib/utils/documentHelper';

interface PreviewModalProps {
    doc: Document;
    onClose: () => void;
}

function PreviewModal({ doc, onClose }: PreviewModalProps) {
    const url = getStorageUrl(doc.file_path);
    const ext = doc.file_path?.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
    const isPdf = ext === 'pdf';

    // Close on backdrop click
    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            let filename = doc.name || 'document';
            // Ensure filename has the correct extension
            if (ext && !filename.toLowerCase().endsWith(`.${ext}`)) {
                filename += `.${ext}`;
            }
            // Sanitize filename to prevent issues with special characters
            filename = filename.replace(/[^a-zA-Z0-9.-_ ]/g, '');
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = downloadUrl;
            document.body.appendChild(iframe);
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 5000);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(url, '_blank');
        }
    };

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={handleBackdrop}
        >
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50">
                            {isImage ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                                </svg>
                            ) : isPdf ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13h6M9 17h4" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1B3A64] text-sm">{doc.name}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{ext.toUpperCase()} • Uploaded</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download
                        </a>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-2 rounded-xl transition-colors hover:from-blue-600 hover:to-blue-800"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Open in New Tab
                        </a>
                        <button
                            onClick={onClose}
                            className="ml-1 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4" style={{ minHeight: '400px' }}>
                    {isImage ? (
                        <img
                            src={url}
                            alt={doc.name}
                            className="max-w-full max-h-full object-contain rounded-xl shadow-md"
                            style={{ maxHeight: 'calc(90vh - 120px)' }}
                        />
                    ) : isPdf ? (
                        <iframe
                            src={url}
                            className="w-full rounded-xl"
                            style={{ height: 'calc(90vh - 120px)', border: 'none' }}
                            title={doc.name}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <p className="text-slate-600 font-semibold">Preview not available for this file type</p>
                            <p className="text-slate-400 text-sm mt-1">Use the Download or Open button above to view this file</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useAuth } from '@/contexts/AuthContext';

export default function DashboardDocumentsPage() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeChecklist, setActiveChecklist] = useState<any>(null);
    const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadingDocName, setUploadingDocName] = useState<string | null>(null);



    const fetchDocuments = () => {
        setIsLoading(true);
        Promise.all([
            api.get('/applications'),
            api.get('/documents'),
            getChecklists()
        ]).then(([appsRes, docsRes, checklistsData]) => {
            const apps = appsRes.data;
            const latestApp = apps.length > 0 ? apps[0] : null;
            const fetchedUploadedDocs = Array.isArray(docsRes.data) ? docsRes.data : [];
            setUploadedDocs(fetchedUploadedDocs);

            let userRole = 'petitioner';
            if (latestApp && latestApp.user_id !== user?.id) {
                const participant = latestApp.participants?.find((p: any) => p.user_id === user?.id);
                if (participant) {
                    userRole = participant.role;
                }
            }

            // Resolve the active checklist (same logic as the form's generateFormChecklist)
            if (latestApp) {
                const serviceText = `${latestApp.title || ''} ${latestApp.service_type || ''}`;
                const checklistKey = getChecklistKeyFromService(serviceText);
                const matchingChecklist = checklistKey ? checklistsData[checklistKey] : null;
                if (matchingChecklist) {
                    // Filter sections by role
                    const filteredChecklist = {
                        ...matchingChecklist,
                        sections: matchingChecklist.sections.filter((section: any) => {
                            const roles = section.assignee_roles;
                            if (!roles || (Array.isArray(roles) && roles.length === 0)) {
                                return userRole === 'petitioner';
                            }
                            
                            let parsedRoles = roles;
                            if (typeof roles === 'string') {
                                try {
                                    parsedRoles = JSON.parse(roles);
                                } catch (e) {
                                    parsedRoles = [roles];
                                }
                            }
                            return Array.isArray(parsedRoles) && parsedRoles.includes(userRole);
                        })
                    };
                    setActiveChecklist(filteredChecklist);
                } else {
                    setActiveChecklist(null);
                }
            } else {
                setActiveChecklist(null);
            }

            const finalDocs = resolveDocuments(latestApp, checklistsData, fetchedUploadedDocs, userRole);
            setDocuments(finalDocs);
        }).catch(err => {
            console.error('Failed to fetch documents or applications', err);
            setDocuments(defaultChecklist);
            setActiveChecklist(null);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => { fetchDocuments(); }, []);

    const triggerUpload = (id: number, docName: string | null = null) => {
        setUploadingId(id);
        setUploadingDocName(docName);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            if (uploadingId && uploadingId > 0) {
                await api.post(`/documents/${uploadingId}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                formData.append('name', uploadingDocName || file.name.replace(/\.[^/.]+$/, ""));
                await api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            fetchDocuments();
        } catch {
            alert('File upload failed. Max size is 10MB.');
        } finally {
            setUploadingId(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getBadgeClass = (status: string) => {
        if (status === 'Uploaded') return 'bg-[#ECFDF5] text-[#047857]';
        if (status === 'Missing') return 'bg-red-50 text-red-600';
        return 'bg-[#EFF6FF] text-[#1D4ED8]';
    };

    const renderDocumentRow = (item: any, isRequired: boolean) => (
        <div key={item.id || item.name} className="sm:grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-[#5A6579] hover:bg-slate-50 transition-colors">
            {/* Name + status sub-text */}
            <div className="col-span-6">
                <p className="font-semibold text-[#1B3A64]">{item.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${isRequired ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                        {isRequired ? 'Required' : 'Optional'}
                    </span>
                    <p className="text-xs text-slate-400">{item.status}</p>
                </div>
            </div>

            {/* Badge */}
            <div className="col-span-2 mt-4 sm:mt-0">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(item.status)}`}>
                    {item.status === 'Uploaded' ? 'Complete' : item.status === 'Missing' ? 'Action required' : 'Pending'}
                </span>
            </div>

            {/* Preview button — only shown when uploaded */}
            <div className="col-span-2 mt-4 sm:mt-0 flex justify-start sm:justify-center">
                {item.status === 'Uploaded' && item.file_path ? (
                    <button
                        onClick={() => setPreviewDoc(item)}
                        className="flex min-w-[100px] items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-xl transition-all"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                        Preview
                    </button>
                ) : (
                    <span className="text-xs text-slate-300">—</span>
                )}
            </div>

            {/* Upload / Replace */}
            <div className="col-span-2 mt-4 sm:mt-0 flex justify-start sm:justify-end">
                <button
                    onClick={() => triggerUpload(item.id && item.id > 0 ? item.id : -1, item.status === 'Missing' ? item.name : null)}
                    disabled={uploadingId === item.id}
                    className={item.status !== 'Uploaded'
                        ? 'rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 w-full sm:w-auto'
                        : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1B3A64] hover:bg-slate-50 transition-colors disabled:opacity-50 w-full sm:w-auto'}
                >
                    {uploadingId === item.id ? '...' : item.status !== 'Uploaded' ? 'Upload' : 'Replace'}
                </button>
            </div>
        </div>
    );

    if (isLoading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading documents...</div>;

    return (
        <>
            {/* Preview Modal */}
            {previewDoc && (
                <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
            )}

            <div className="space-y-10">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" />

                <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Documents</p>
                            <h1 className="mt-4 text-4xl font-black text-[#1B3A64]">Upload and review files</h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                                Keep your case moving by uploading documents early and checking the status of every required file.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => triggerUpload(-1)}
                                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all text-sm flex items-center gap-2"
                            >
                                <span className="text-base">+</span> Upload Document
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 overflow-x-auto rounded-[28px] border border-slate-200">
                        <div className="min-w-full">
                            {/* Table header — hidden on small screens, shown on sm+ */}
                            <div className="hidden sm:grid grid-cols-12 gap-4 bg-[#F8F6F3] px-6 py-4 text-sm font-semibold text-[#5A6579]">
                                <span className="col-span-6">Document</span>
                                <span className="col-span-2">Status</span>
                                <span className="col-span-2 text-center">Preview</span>
                                <span className="col-span-2 text-right">Action</span>
                            </div>
                            {activeChecklist ? (
                                <div className="bg-white">
                                    {activeChecklist.sections.map((section: any, sIdx: number) => (
                                        <div key={sIdx}>
                                            <div className="bg-slate-50 px-6 py-3 border-y border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between">
                                                <p className="text-sm font-bold text-[#1B3A64] flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white flex items-center justify-center text-xs">{sIdx + 1}</span>
                                                    {section.title}
                                                </p>
                                                <p className="text-xs font-semibold text-[#5A6579] mt-2 sm:mt-0 ml-7 sm:ml-0 bg-white px-3 py-1 rounded-full border border-slate-200">
                                                    {section.documents.filter((d: any) => d.required).length} required • {section.documents.filter((d: any) => !d.required).length} optional
                                                </p>
                                            </div>
                                            <div className="divide-y divide-slate-100">
                                                {section.documents.map((reqDoc: any, dIdx: number) => {
                                                    const uploadedMatch = uploadedDocs.find(d => isMatch(reqDoc.name, d.name));
                                                    const item = uploadedMatch || { id: -Math.random(), name: reqDoc.name, status: 'Missing', file_path: null };
                                                    return renderDocumentRow(item, reqDoc.required);
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Extra Uploaded Documents that don't fit in any section */}
                                    {(() => {
                                        const extraDocs = uploadedDocs.filter(d => {
                                            return !activeChecklist.sections.some((sec: any) => sec.documents.some((reqDoc: any) => isMatch(reqDoc.name, d.name)));
                                        });
                                        if (extraDocs.length > 0) {
                                            return (
                                                <div>
                                                    <div className="bg-slate-50 px-6 py-3 border-y border-slate-200">
                                                        <p className="text-sm font-bold text-[#1B3A64] flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white flex items-center justify-center text-xs">{activeChecklist.sections.length + 1}</span>
                                                            Additional Uploaded Documents
                                                        </p>
                                                    </div>
                                                    <div className="divide-y divide-slate-100">
                                                        {extraDocs.map((item) => renderDocumentRow(item, false))}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200 bg-white">
                                    {documents.length === 0 ? (
                                        <div className="p-6 text-center text-[#5A6579]">No documents requested yet.</div>
                                    ) : documents.map((item) => renderDocumentRow(item, item.required === true))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[40px] bg-gradient-to-b from-orange-500 to-orange-600/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Upload reminders</p>
                        <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Documents still needed</h2>
                        <ul className="mt-6 space-y-4 text-sm leading-7 text-[#5A6579]">
                            {documents.filter(d => d.status !== 'Uploaded' && d.required === true).slice(0, 3).map(d => (
                                <li key={d.id} className="flex items-center gap-3">
                                    <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
                                    {d.name}
                                </li>
                            ))}
                            {documents.filter(d => d.status !== 'Uploaded' && d.required === true).length === 0 && (
                                <li className="flex items-center gap-3 text-emerald-600 font-semibold">
                                    <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                                    All required documents uploaded!
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Document tips</p>
                        <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Submit clean files the first time</h2>
                        <ul className="mt-6 space-y-4 text-sm text-[#5A6579]">
                            <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                                Use clear scans or photos with all text legible and edges visible.
                            </li>
                            <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                                Upload PDF, JPG, or PNG files under 10MB each for faster review.
                            </li>
                            <li className="rounded-3xl border border-slate-200 bg-[#F8F6F3] p-4">
                                Label every file with document type and client name before uploading.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
