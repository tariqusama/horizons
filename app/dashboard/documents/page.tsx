'use client';
import React, { useEffect, useState, useRef } from "react";
import api, { getStorageUrl } from "@/lib/api";
import { CHECKLISTS } from "../../manager/(dashboard)/document-checklists/page";
interface Document {
    id: number;
    name: string;
    status: string;
    file_path: string | null;
}

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
                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                                </svg>
                            ) : isPdf ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
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
                            download
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
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
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Open in New Tab
                        </a>
                        <button
                            onClick={onClose}
                            className="ml-1 w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
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

export default function DashboardDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultChecklist: Document[] = [
        { id: 1, name: 'Passport photo page', status: 'Missing', file_path: null },
        { id: 2, name: 'Birth certificate', status: 'Missing', file_path: null },
        { id: 3, name: 'Proof of residency', status: 'Missing', file_path: null },
        { id: 4, name: 'Medical exam report', status: 'Missing', file_path: null },
        { id: 5, name: 'Affidavit of support', status: 'Missing', file_path: null },
        { id: 6, name: 'Government Issued Photo ID', status: 'Missing', file_path: null },
        { id: 7, name: 'Permanent Resident Card', status: 'Missing', file_path: null },
        { id: 8, name: 'Signed Statement', status: 'Missing', file_path: null },
    ];

    const fetchDocuments = () => {
        setIsLoading(true);
        Promise.all([
            api.get('/applications'),
            api.get('/documents')
        ]).then(([appsRes, docsRes]) => {
            const apps = appsRes.data;
            const latestApp = apps.length > 0 ? apps[0] : null;
            let expectedDocs: Document[] = [];
            const uploadedDocs = Array.isArray(docsRes.data) ? docsRes.data : [];

            if (latestApp && latestApp.service_type) {
                // We need to import CHECKLISTS but we can't easily dynamically require it if not imported.
                // It's imported at the top now!
                const checklistValues = Object.values(CHECKLISTS);
                const matchingChecklist = checklistValues.find((c: any) => c.title === latestApp.service_type) || checklistValues[0];
                
                let tempId = 1000;
                matchingChecklist.sections.forEach((section: any) => {
                    section.documents.forEach((d: any) => {
                        expectedDocs.push({
                            id: tempId++,
                            name: d.name,
                            status: 'Missing',
                            file_path: null
                        });
                    });
                });
            } else {
                expectedDocs = [...defaultChecklist];
            }

            const isMatch = (reqName: string, docName: string) => {
                if (!docName || !reqName) return false;
                const r = reqName.toLowerCase().replace(/[^a-z0-9]/g, '');
                const d = docName.toLowerCase().replace(/[^a-z0-9]/g, '');
                return r.includes(d) || d.includes(r) || (r.includes('greencard') && d.includes('permanentresident')) || (r.includes('photo') && d.includes('photo')) || (r.includes('statement') && d.includes('statement'));
            };

            const finalDocs = [...expectedDocs];
            
            uploadedDocs.forEach((uploaded: Document) => {
                const matchIndex = finalDocs.findIndex(f => f.status === 'Missing' && isMatch(f.name, uploaded.name));
                if (matchIndex !== -1) {
                    finalDocs[matchIndex] = uploaded;
                } else {
                    finalDocs.push(uploaded);
                }
            });

            setDocuments(finalDocs);
        }).catch(err => {
            console.error('Failed to fetch documents or applications', err);
            setDocuments(defaultChecklist);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => { fetchDocuments(); }, []);

    const triggerUpload = (id: number) => {
        setUploadingId(id);
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
                formData.append('name', file.name.replace(/\.[^/.]+$/, ""));
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

                    <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200">
                        {/* Table header — 4 cols now: doc / status / preview / action */}
                        <div className="grid grid-cols-12 gap-4 bg-[#F8F6F3] px-6 py-4 text-sm font-semibold text-[#5A6579]">
                            <span className="col-span-6">Document</span>
                            <span className="col-span-2">Status</span>
                            <span className="col-span-2 text-center">Preview</span>
                            <span className="col-span-2 text-right">Action</span>
                        </div>
                        <div className="divide-y divide-slate-200 bg-white">
                            {documents.length === 0 ? (
                                <div className="p-6 text-center text-[#5A6579]">No documents requested yet.</div>
                            ) : documents.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-[#5A6579] hover:bg-slate-50 transition-colors">
                                    {/* Name + status sub-text */}
                                    <div className="col-span-6">
                                        <p className="font-semibold text-[#1B3A64]">{item.name}</p>
                                        <p className="mt-1 text-xs text-slate-400">{item.status}</p>
                                    </div>

                                    {/* Badge */}
                                    <div className="col-span-2">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(item.status)}`}>
                                            {item.status === 'Uploaded' ? 'Complete' : item.status === 'Missing' ? 'Action required' : 'Pending'}
                                        </span>
                                    </div>

                                    {/* Preview button — only shown when uploaded */}
                                    <div className="col-span-2 flex justify-center">
                                        {item.status === 'Uploaded' && item.file_path ? (
                                            <button
                                                onClick={() => setPreviewDoc(item)}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-xl transition-all"
                                            >
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                                </svg>
                                                Preview
                                            </button>
                                        ) : (
                                            <span className="text-xs text-slate-300">—</span>
                                        )}
                                    </div>

                                    {/* Upload / Replace */}
                                    <div className="col-span-2 text-right">
                                        <button
                                            onClick={() => triggerUpload(item.id)}
                                            disabled={uploadingId === item.id}
                                            className={item.status !== 'Uploaded'
                                                ? 'rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:from-orange-600 hover:to-orange-700 disabled:opacity-50'
                                                : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1B3A64] hover:bg-slate-50 transition-colors disabled:opacity-50'}
                                        >
                                            {uploadingId === item.id ? '...' : item.status !== 'Uploaded' ? 'Upload' : 'Replace'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[40px] bg-gradient-to-b from-orange-500 to-orange-600/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-500">Upload reminders</p>
                        <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Documents still needed</h2>
                        <ul className="mt-6 space-y-4 text-sm leading-7 text-[#5A6579]">
                            {documents.filter(d => d.status !== 'Uploaded').slice(0, 3).map(d => (
                                <li key={d.id} className="flex items-center gap-3">
                                    <span className="inline-flex h-3 w-3 rounded-full bg-gradient-to-b from-orange-500 to-orange-600" />
                                    {d.name}
                                </li>
                            ))}
                            {documents.filter(d => d.status !== 'Uploaded').length === 0 && (
                                <li className="flex items-center gap-3 text-emerald-600 font-semibold">
                                    <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                                    All documents uploaded!
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
