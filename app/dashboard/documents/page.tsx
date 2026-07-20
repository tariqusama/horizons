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

    const fetchDocuments = () => {
        setIsLoading(true);
        api.get('/api/documents')
            .then(res => setDocuments(res.data))
            .catch(err => console.error(err))
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
        if (!file || !uploadingId) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/api/documents/${uploadingId}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments(); // Refresh the list
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
                <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Documents</p>
                <h1 className="mt-4 text-4xl font-black text-[#1B3A64]">Upload and review files</h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#5A6579]">
                    Keep your case moving by uploading documents early and checking the status of every required file.
                </p>

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
                                            ? "rounded-full bg-[#E3755D] px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-[#C8634D] disabled:opacity-50" 
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
                <div className="rounded-[40px] bg-[#E3755D]/5 p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Upload reminders</p>
                    <h2 className="mt-4 text-2xl font-black text-[#1B3A64]">Documents still needed</h2>
                    <ul className="mt-6 space-y-4 text-sm leading-7 text-[#5A6579]">
                        {documents.filter(d => d.status !== 'Uploaded').slice(0, 3).map(d => (
                            <li key={d.id} className="flex items-center gap-3">
                                <span className="inline-flex h-3 w-3 rounded-full bg-[#E3755D]" />
                                {d.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-[40px] bg-white p-10 shadow-[0_25px_70px_rgba(61,68,101,0.08)]">
                    <p className="text-sm uppercase tracking-[0.28em] text-[#E3755D]">Document tips</p>
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
