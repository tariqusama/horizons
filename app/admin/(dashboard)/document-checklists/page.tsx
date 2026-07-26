'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getChecklists } from '@/lib/api/cases';

const Icon = {
    chevronRight: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>,
    check: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
};

function DocumentChecklistsContent() {
    const searchParams = useSearchParams();
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [checklists, setChecklists] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getChecklists().then((data) => {
            setChecklists(data);
            setIsLoading(false);
        }).catch(err => {
            console.error('Failed to fetch checklists:', err);
            setIsLoading(false);
        });
    }, []);

    const type = searchParams?.get?.('type') || 'spouse_abroad';
    const checklist = checklists[type] || null;

    if (isLoading) return <div className="p-10 text-center animate-pulse text-[#5B6472]">Loading checklists...</div>;
    if (!checklist) return <div className="p-10 text-center text-[#5B6472]">Checklist not found.</div>;

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (!checklist) {
        return (
            <div className="max-w-[1200px] mx-auto w-full pb-12">
                <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-8 text-center">
                    <p className="text-lg font-bold text-[#101F38]">Checklist not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[900px] mx-auto w-full pb-12">
            {/* Header */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#101F38] mb-2">{checklist.title}</h1>
                        <p className="text-sm text-[#5B6472] font-medium mb-3">Required Forms</p>
                        <div className="flex flex-wrap gap-2">
                            {checklist.forms.map((form: any, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full bg-[#E5F1FF] text-[#2563EB] text-xs font-semibold">
                                    {form}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#FBF1EA]">
                        <span className="text-2xl font-bold text-orange-500">{checklist.totalDocuments}</span>
                    </div>
                </div>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-6">
                {checklist.sections.map((section: any, sectionIdx: number) => (
                    <div key={sectionIdx} className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#101F38] mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-b from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm font-bold">
                                {sectionIdx + 1}
                            </span>
                            {section.title}
                        </h2>

                        <div className="space-y-3">
                            {section.documents.map((doc: any, docIdx: number) => {
                                const docId = `${sectionIdx}-${docIdx}`;
                                const isChecked = checkedItems[docId] || false;

                                return (
                                    <div key={docId} className="flex items-start gap-3 p-4 rounded-2xl border border-[#ECE9E2] hover:bg-[#F7F5F0] transition-colors cursor-pointer" onClick={() => toggleCheck(docId)}>
                                        <div className="w-6 h-6 rounded border-2 border-[#ECE9E2] flex items-center justify-center shrink-0 mt-1 bg-white transition-all" style={{
                                            borderColor: isChecked ? '#f97316' : '#ECE9E2',
                                            backgroundColor: isChecked ? '#f97316' : 'white',
                                        }}>
                                            {isChecked && <Icon.check width={16} height={16} className="text-white" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${isChecked ? 'line-through text-[#8A8F98]' : 'text-[#101F38]'}`}>{doc.name}</p>
                                            <div className="mt-2 flex gap-2">
                                                {doc.required ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E24B4A]/10 text-[#E24B4A] text-xs font-semibold">
                                                        Required
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                                                        Optional
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#101F38]">Document Collection Progress</p>
                    <span className="text-xs font-bold text-orange-500">
                        {Object.values(checkedItems).filter(Boolean).length} of {checklist.totalDocuments}
                    </span>
                </div>
                <div className="w-full bg-[#ECE9E2] rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-b from-orange-500 to-orange-600 transition-all"
                        style={{ width: `${(Object.values(checkedItems).filter(Boolean).length / checklist.totalDocuments) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function DocumentChecklistsPage() {
    return (
        <Suspense fallback={<div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <DocumentChecklistsContent />
        </Suspense>
    );
}
