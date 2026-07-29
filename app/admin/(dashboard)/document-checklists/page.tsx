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

    const totalDocs = checklist.sections ? checklist.sections.reduce((acc: number, section: any) => acc + (section.documents?.length || 0), 0) : (checklist.totalDocuments || 0);

    return (
        <div className="space-y-6 max-w-[900px] mx-auto w-full pb-12 pt-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-slate-200">
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h3 className="font-semibold tracking-tight text-2xl text-slate-900">{checklist.title}</h3>
                            {checklist.forms && checklist.forms.length > 0 && (
                                <p className="text-sm text-slate-500 mt-2">
                                    Form {checklist.forms.map((f: string) => f.split(' (')[0]).join(' + ')}
                                </p>
                            )}
                        </div>
                        {totalDocs > 0 && (
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-orange-50 text-orange-700 border-orange-200">
                                {totalDocs} documents
                            </div>
                        )}
                    </div>
                </div>
                {checklist.forms && checklist.forms.length > 0 && (
                    <div className="p-6 pt-0 space-y-2 text-sm text-slate-600">
                        <p>Forms: {checklist.forms.join(', ')}.</p>
                    </div>
                )}
            </div>

            {checklist.sections.map((section: any, sectionIdx: number) => (
                <div key={sectionIdx} className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white border-slate-200">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-lg flex items-center gap-2 text-slate-900">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text w-4 h-4 text-orange-500">
                                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>
                            </svg>
                            {section.title}
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <ul className="space-y-2">
                            {section.documents.map((doc: any, docIdx: number) => {
                                const docId = `${sectionIdx}-${docIdx}`;
                                return (
                                    <li key={docId} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors bg-white">
                                        {doc.required ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check w-4 h-4 mt-0.5 shrink-0 text-orange-500">
                                                <circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check w-4 h-4 mt-0.5 shrink-0 text-slate-300">
                                                <circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>
                                            </svg>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm text-slate-800">{doc.name}</div>
                                        </div>
                                        {doc.required ? (
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-orange-50 text-orange-700 border-orange-200">Required</div>
                                        ) : (
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-slate-50 text-slate-600 border-slate-200">Optional</div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            ))}

            <div className="text-xs text-slate-500 pt-2">
                <button onClick={() => window.history.back()} className="hover:text-slate-900 underline">← Back to assigned cases</button>
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
