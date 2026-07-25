'use client';
import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";

interface Document {
    id: number;
    name: string;
    status: string;
    file_path: string | null;
}

export default function DashboardDocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
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
        api.get('/documents')
            .then(res => {
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setDocuments(res.data);
                } else {
                    setDocuments(defaultChecklist);
                }
            })
            .catch(err => {
                console.error(err);
                setDocuments(defaultChecklist);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

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
                await api.post(`/documents/${uploadingId}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                formData.append('name', file.name.replace(/\.[^/.]+$/, ""));
                await api.post('/documents/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchDocuments(); // Refresh list persistently
        } catch (error) {
            console.error('Upload failed', error);
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

    if (isLoading) return <div className="p-10">Loading documents...</div>;

    return (
        <div className="space-y-10">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

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
                    <div className="grid grid-cols-12 gap-4 bg-[#F8F6F3] px-6 py-4 text-sm font-semibold text-[#5A6579]">
                        <span className="col-span-7">Document</span>
                        <span className="col-span-3">Status</span>
                        <span className="col-span-2 text-right">Action</span>
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                        {documents.length === 0 ? (
                            <div className="p-6 text-center text-[#5A6579]">No documents requested yet.</div>
                        ) : documents.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-[#5A6579]">
                                <div className="col-span-7">
                                    <p className="font-semibold text-[#1B3A64]">{item.name}</p>
                                    <p className="mt-1 text-sm">{item.status}</p>
                                </div>
                                <div className="col-span-3">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(item.status)}`}>
                                        {item.status === 'Uploaded' ? 'Complete' : (item.status === 'Missing' ? 'Action required' : 'Pending')}
                                    </span>
                                </div>
                                <div className="col-span-2 text-right">
                                    <button
                                        onClick={() => triggerUpload(item.id)}
                                        disabled={uploadingId === item.id}
                                        className={item.status !== "Uploaded"
                                            ? "rounded-full bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                                            : "rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1B3A64] hover:bg-slate-50 transition-colors disabled:opacity-50"}
                                    >
                                        {uploadingId === item.id ? '...' : (item.status !== "Uploaded" ? "Upload" : "Replace")}
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
    );
}
