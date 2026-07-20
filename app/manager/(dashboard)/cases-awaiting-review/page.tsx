'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    getManagerAssignedCases,
    updateApplication,
    Application,
} from '@/lib/api/cases';

const Icon = {
    search: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    chevronDown: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
    checkCircle: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><polyline points="16 12 12 8 8 12" /></svg>,
    clock: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><polyline points="12 6 12 12 16 14" /></svg>,
    user: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" /><path d="M6 20a6 6 0 0 1 12 0" /></svg>,
    fileText: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /></svg>,
    checkmark: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    x: (p: any) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
};

export default function CasesAwaitingReviewPage() {
    const { user } = useAuth();
    const [cases, setCases] = useState<Application[]>([]);
    const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

    const selectedCase = cases.find((c) => c.id === selectedCaseId) ?? cases[0] ?? null;

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                const myCases = await getManagerAssignedCases();
                // Filter cases that are awaiting review (status pending, in review, etc.)
                const awaitingReview = myCases.filter((c: Application) =>
                    c.status === 'pending' || c.status === 'review' || c.status === 'awaiting_review'
                );
                setCases(awaitingReview);
            } catch (err) {
                console.error('Failed to fetch cases awaiting review:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    useEffect(() => {
        if (!selectedCaseId && cases.length > 0) {
            setSelectedCaseId(cases[0].id);
        }
    }, [cases, selectedCaseId]);

    const searchParams = useSearchParams();
    useEffect(() => {
        const param = searchParams?.get?.('caseId');
        if (param && cases.length > 0) {
            const id = Number(param);
            if (!Number.isNaN(id)) {
                const exists = cases.some((c) => c.id === id);
                if (exists) setSelectedCaseId(id);
            }
        }
    }, [searchParams, cases]);

    const handleApprove = async () => {
        if (!selectedCase) return;

        try {
            const updatedCase = await updateApplication(selectedCase.id, {
                status: 'approved',
            });
            setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
        } catch (err) {
            console.error('Unable to approve case:', err);
            alert('Unable to approve case. Please try again.');
        }
    };

    const handleReject = async () => {
        if (!selectedCase) return;

        try {
            const updatedCase = await updateApplication(selectedCase.id, {
                status: 'rejected',
            });
            setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
        } catch (err) {
            console.error('Unable to reject case:', err);
            alert('Unable to reject case. Please try again.');
        }
    };

    const filteredCases = cases.filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (c.user?.name || '').toLowerCase().includes(q) || (c.user?.email || '').toLowerCase().includes(q);
    });

    if (isLoading) {
        return (
            <div className="max-w-[1200px] mx-auto w-full h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E3755D]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full pb-12">
            {/* Header */}
            <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A8F98] font-semibold mb-1">Cases Awaiting Review</p>
                        <p className="text-base font-bold text-[#101F38]">{selectedCase?.user?.name || 'No cases'}</p>
                        <p className="text-xs text-[#5B6472] font-medium">{selectedCase?.user?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-[#ECE9E2] bg-[#F7F5F0] px-4 py-2.5">
                            <Icon.search width={15} height={15} className="text-[#8A8F98] shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search cases..."
                                className="bg-transparent border-none outline-none text-sm text-[#101F38] placeholder:text-[#8A8F98] w-40"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={selectedCase?.id ?? ''}
                                onChange={(e) => setSelectedCaseId(Number(e.target.value))}
                                className="appearance-none rounded-full border border-[#ECE9E2] bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-[#101F38] focus:outline-none focus:ring-2 focus:ring-[#E3755D]/30 cursor-pointer"
                            >
                                {filteredCases.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.user?.email || `Case #${c.id}`}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8A8F98]">
                                <Icon.chevronDown width={14} height={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Case Details */}
            {selectedCase && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Client Info */}
                        <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6">
                            <h3 className="text-lg font-bold text-[#101F38] mb-4">Client Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Icon.user width={18} height={18} className="text-[#E3755D]" />
                                    <div>
                                        <p className="text-xs text-[#8A8F98] font-medium">Name</p>
                                        <p className="text-sm font-semibold text-[#101F38]">{selectedCase.user?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon.fileText width={18} height={18} className="text-[#E3755D]" />
                                    <div>
                                        <p className="text-xs text-[#8A8F98] font-medium">Email</p>
                                        <p className="text-sm font-semibold text-[#101F38]">{selectedCase.user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon.clock width={18} height={18} className="text-[#E3755D]" />
                                    <div>
                                        <p className="text-xs text-[#8A8F98] font-medium">Submission Date</p>
                                        <p className="text-sm font-semibold text-[#101F38]">
                                            {selectedCase.created_at ? new Date(selectedCase.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Summary */}
                        <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6">
                            <h3 className="text-lg font-bold text-[#101F38] mb-4">Case Summary</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-[#8A8F98] font-medium mb-2">Status</p>
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        {selectedCase.status ? selectedCase.status.replace(/_/g, ' ').toUpperCase() : 'PENDING'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-[#8A8F98] font-medium mb-2">Service Type</p>
                                    <p className="text-sm font-semibold text-[#101F38]">{selectedCase.service_type || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Review Actions */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-6 sticky top-6">
                            <h3 className="text-lg font-bold text-[#101F38] mb-6">Review Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleApprove}
                                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#3B6D11] text-white px-4 py-3 text-sm font-semibold hover:bg-[#2f5509] transition-colors"
                                >
                                    <Icon.checkmark width={16} height={16} />
                                    Approve Case
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full flex items-center justify-center gap-2 rounded-full border border-[#E24B4A] text-[#E24B4A] px-4 py-3 text-sm font-semibold hover:bg-[#FCEBEB] transition-colors"
                                >
                                    <Icon.x width={16} height={16} />
                                    Reject Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {cases.length === 0 && !isLoading && (
                <div className="rounded-3xl border border-[#ECE9E2] bg-white shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EAF3DE] mb-4">
                        <Icon.checkCircle width={32} height={32} className="text-[#3B6D11]" />
                    </div>
                    <p className="text-lg font-bold text-[#101F38] mb-2">No cases awaiting review</p>
                    <p className="text-sm text-[#5B6472]">All cases have been reviewed or are in progress.</p>
                </div>
            )}
        </div>
    );
}
