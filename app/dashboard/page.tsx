"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import ApplicationSelectionModal from "@/app/components/ApplicationSelectionModal";
import InviteParticipantModal from "@/components/InviteParticipantModal";
import { getChecklists } from '@/lib/api/cases';
import { resolveDocuments } from '@/lib/utils/documentHelper';

const getPlanPrice = (title: string, subtitle: string) => {
    if (!title || !subtitle) return '--';

    const isPremium = subtitle.includes('Premium');
    const isAdvanced = subtitle.includes('Advanced');

    if (title.includes('Adjust status')) {
        if (isPremium) return '$1249.99';
        if (isAdvanced) return '$949.99';
        return '$599.99';
    }
    if (title.includes('Bring a fiancé(e)') || title.includes('K-1 Fiancé Visa')) {
        if (isPremium) return '$1049.99';
        if (isAdvanced) return '$849.99';
        return '$549.99';
    }
    if (title.includes('Bring a spouse') || title.includes('Bring a sibling') || title.includes('relative') || title.includes('Petition for a')) {
        if (isPremium) return '$999.99';
        if (isAdvanced) return '$789.99';
        return '$549.99';
    }
    if (title.includes('Remove conditions')) {
        if (isPremium) return '$699.99';
        if (isAdvanced) return '$499.99';
        return '$399.99';
    }
    if (title.includes('Replace or fix')) {
        if (isPremium) return '$599.99';
        if (isAdvanced) return '$449.99';
        return '$349.99';
    }
    if (title.includes('DACA')) {
        if (isPremium) return '$539.99';
        if (isAdvanced) return '$399.99';
        return '$299.99';
    }
    if (title.includes('Citizenship')) {
        if (isPremium) return '$649.99';
        if (isAdvanced) return '$449.99';
        return '$349.99';
    }

    if (isPremium) return '$599.99';
    if (isAdvanced) return '$449.99';
    return '$349.99';
};

const getApplicationStatusMeta = (status?: string) => {
    const normalized = (status || '').toString().trim().toLowerCase();

    if (['approved', 'approved by admin', 'approved by uscis'].includes(normalized)) {
        return {
            label: 'Approved',
            tone: 'success',
            isDecision: true,
            isSubmittedLike: true,
            route: '/dashboard/case-status',
            actionLabel: 'View Status',
            helperText: 'Your application has been approved.'
        };
    }

    if (['denied', 'rejected', 'declined'].includes(normalized)) {
        return {
            label: 'Denied',
            tone: 'danger',
            isDecision: true,
            isSubmittedLike: true,
            route: '/dashboard/case-status',
            actionLabel: 'View Status',
            helperText: 'Your application decision is available.'
        };
    }

    if (['submitted', 'completed', 'review', 'in review', 'under review'].includes(normalized)) {
        return {
            label: 'In Review',
            tone: 'info',
            isDecision: false,
            isSubmittedLike: true,
            route: '/dashboard/get-started/submission',
            actionLabel: 'View Application',
            helperText: 'Your application is being reviewed.'
        };
    }

    if (['pending', 'in progress', 'active', 'processing'].includes(normalized)) {
        return {
            label: 'In Progress',
            tone: 'warning',
            isDecision: false,
            isSubmittedLike: false,
            route: '/dashboard/get-started',
            actionLabel: 'Continue Application',
            helperText: 'You are still working on this application.'
        };
    }

    return {
        label: status || 'Pending',
        tone: 'default',
        isDecision: false,
        isSubmittedLike: false,
        route: '/dashboard/get-started',
        actionLabel: 'Continue Application',
        helperText: 'Your application is being prepared.'
    };
};

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showChatError, setShowChatError] = useState(false);
    const [showWrongPackageError, setShowWrongPackageError] = useState(false);
    const [showPaymentError, setShowPaymentError] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    // Use the most recently updated application for the dashboard context
    const latestApplication = applications[0];
    const pendingBalance = latestApplication ? (Number(latestApplication.amount || 0) - Number(latestApplication.paid_amount || 0)) : 0;
    const ownedApplications = applications.filter(app => app.user_id === user?.id);
    const isParticipantOnly = applications.length > 0 && ownedApplications.length === 0;

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (typeof window !== 'undefined') {
                    const urlParams = new URLSearchParams(window.location.search);
                    const sessionId = urlParams.get('session_id');
                    if (sessionId) {
                        await api.post('/payment/verify', { session_id: sessionId });
                        // Clean up URL without refreshing the page
                        window.history.replaceState({}, document.title, window.location.pathname);
                        alert('Payment successful! Your application status has been updated.');
                    }
                }

                const [appsRes, docsRes, messagesRes, checklistsData] = await Promise.all([
                    api.get('/applications'),
                    api.get('/documents'),
                    api.get('/messages'),
                    getChecklists()
                ]);

                const apps = appsRes.data || [];
                const latestApp = apps.length > 0 ? apps[0] : null;
                const fetchedUploadedDocs = Array.isArray(docsRes.data) ? docsRes.data : [];
                
                let userRole = 'petitioner';
                if (latestApp && user && latestApp.user_id !== user.id) {
                    const participant = latestApp.participants?.find((p: any) => p.user_id === user.id);
                    if (participant) {
                        userRole = participant.role;
                    }
                }

                const finalDocs = resolveDocuments(latestApp, checklistsData, fetchedUploadedDocs, userRole);

                setApplications(apps);
                setDocuments(finalDocs);
                setMessages(messagesRes.data || []);
            } catch (error) {
                console.error('Failed to load dashboard metrics', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (latestApplication && typeof window !== 'undefined') {
            if (latestApplication.is_escalated === false || latestApplication.is_escalated === 0) {
                window.localStorage.removeItem('wrong_package_reported');
            }
        }
    }, [latestApplication]);

    const openForm = () => {
        if (typeof window !== 'undefined' && window.localStorage.getItem('wrong_package_reported') === 'true') {
            setShowWrongPackageError(true);
            return;
        }
        if (pendingBalance > 0 || latestApplication?.status === 'Pending') {
            setShowPaymentError(true);
            return;
        }
        if (!latestApplication) {
            return;
        }

        const statusMeta = getApplicationStatusMeta(latestApplication.status);
        router.push(statusMeta.route);
    };

    const handlePayBalance = async () => {
        setIsPaying(true);
        try {
            const res = await api.post('/payment/process', {
                amount: pendingBalance,
                email: user?.email || 'user@example.com',
                plan: 'Package Upgrade Balance',
                goal: 'Payment for upgraded package difference'
            });
            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                alert('Payment processing failed: No checkout URL returned.');
                setIsPaying(false);
            }
        } catch (e: any) {
            console.error('Payment failed', e);
            alert(e.response?.data?.message || e.message || 'Payment failed to process.');
            setIsPaying(false);
        }
    };

    const headlineName = user?.name ? user.name.split(' ')[0] : 'there';
    const activeCount = applications.length;
    const pendingDocuments = documents.filter((doc) => doc.status !== 'Uploaded').length;
    const unreadMessages = messages.length;
    const latestStatusMeta = getApplicationStatusMeta(latestApplication?.status);

    return (
        <main className="flex-1 px-4 sm:px-6 pb-8 pt-2">
            <div className="space-y-6">
                {pendingBalance > 0 && (
                    <div className="mb-6 bg-[#FEF2F2] border border-[#FCA5A5] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                            <div className="bg-[#FEE2E2] text-[#DC2626] p-3 rounded-full">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#991B1B]">Pending Balance Due: ${pendingBalance.toFixed(2)}</h3>
                                <p className="text-sm text-[#B91C1C] mt-1">Your package has been updated by the Admin. Please pay the remaining balance to proceed.</p>
                            </div>
                        </div>
                        <button
                            onClick={handlePayBalance}
                            disabled={isPaying}
                            className="w-full md:w-auto px-6 py-3 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] transition shadow-md whitespace-nowrap disabled:opacity-50"
                        >
                            {isPaying ? 'Processing...' : 'Pay Balance Now'}
                        </button>
                    </div>
                )}

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-100 via-blue-50 to-sky-100 px-6 sm:px-10 py-8 sm:py-10">
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-60 pointer-events-none">
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/60" />
                        <div className="absolute right-24 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-white/60" />
                    </div>
                    <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Welcome back, {headlineName}!</h1>
                            <p className="mt-2 text-slate-600">Track your immigration applications and documents</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/chat')}
                            className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-600">
                                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                            </svg>
                            Chat with Case Manager
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-slate-600">Active Applications</p>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-orange-50">
                                <img src="/checklist.png" alt="Active Applications" className="w-5 h-5 object-contain" />
                            </span>
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            <p className="text-3xl font-bold text-slate-900">{isLoading ? '–' : activeCount}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{activeCount === 0 ? 'No active applications' : `${activeCount} active application${activeCount > 1 ? 's' : ''}`}</p>
                    </div>

                    {!isParticipantOnly && (
                        <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-slate-600">Total Purchases</p>
                                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                                    <img src="/shopping-bag.png" alt="Total Purchases" className="w-5 h-5 object-contain" />
                                </span>
                            </div>
                            <div className="mt-6 flex items-end gap-2">
                                <p className="text-3xl font-bold text-slate-900">{isLoading ? '–' : ownedApplications.length}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Service packages purchased</p>
                        </div>
                    )}

                    <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <div className="flex items-start justify-between">
                            <p className="text-sm font-medium text-slate-600">Pending Actions</p>
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-violet-50">
                                <img src="/file.svg" alt="Pending Actions" className="w-5 h-5 object-contain" />
                            </span>
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            <p className="text-3xl font-bold text-slate-900">{isLoading ? '–' : pendingDocuments}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Items requiring attention</p>
                    </div>

                    {!isParticipantOnly && (
                        <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-sky-50">
                                    <img src="/immunity.png" alt="Success Rate" className="w-5 h-5 object-contain" />
                                </span>
                            </div>
                            <div className="mt-6 flex items-end gap-2">
                                <p className="text-3xl font-bold text-slate-900">{applications.length > 0 ? '100%' : '0%'}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Application success rate</p>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                        <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
                            <button onClick={openForm} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition text-left">
                                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-50">
                                    <img src="/personal-profile_1.png" alt="Start Application" className="w-6 h-6 object-contain" />
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        {latestApplication
                                            ? `${latestStatusMeta.actionLabel} — ${latestApplication.title}`
                                            : 'Start Application'}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {latestApplication ? latestStatusMeta.helperText : 'Continue with your purchased package'}
                                    </p>
                                </div>
                            </button>
                            <button onClick={() => router.push('/dashboard/applications')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition text-left">
                                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-rose-50">
                                    <img src="/completed-task.png" alt="Complete Application" className="w-6 h-6 object-contain" />
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-900">View All Applications</p>
                                    <p className="text-sm text-slate-500">Manage all your active and past applications</p>
                                </div>
                            </button>
                            <button onClick={() => router.push('/dashboard/documents')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition text-left">
                                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-sky-50">
                                    <img src="/analysis.png" alt="View Documents" className="w-6 h-6 object-contain" />
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-900">View Documents</p>
                                    <p className="text-sm text-slate-500">Access your uploaded documents and files</p>
                                </div>
                            </button>
                            <button onClick={() => router.push('/dashboard/helpline')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition text-left">
                                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50">
                                    <img src="/customer-service.png" alt="Contact Support" className="w-6 h-6 object-contain" />
                                </span>
                                <div>
                                    <p className="font-semibold text-slate-900">Contact Support</p>
                                    <p className="text-sm text-slate-500">Get help from our immigration experts</p>
                                </div>
                            </button>
                            {latestApplication && ['i-130', 'i-129f', 'i-485', 'i-751'].includes(latestApplication.form_slug) && latestStatusMeta.label === 'In Progress' && (
                                <button onClick={() => setIsInviteModalOpen(true)} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition text-left">
                                    <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-violet-50">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-violet-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                                    </span>
                                    <div>
                                        <p className="font-semibold text-slate-900">Invite Participant</p>
                                        <p className="text-sm text-slate-500">Invite a joint sponsor or beneficiary</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {!isParticipantOnly && (
                            <div className="rounded-3xl bg-white border border-slate-200/70 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                                <div className="flex items-start gap-3">
                                    <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center p-1">
                                        <img src="/shopping-cart-new.png" alt="Your Purchases" className="w-8 h-8 object-contain" />
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Your Purchases</h3>
                                        <p className="text-xs text-slate-500">View and manage your immigration service purchases</p>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-slate-100 pt-4">
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {ownedApplications.length > 0 ? ownedApplications.map((app, idx) => (
                                            <div key={app.id || idx} className="rounded-xl border border-slate-100 p-3 hover:border-orange-200 transition-colors">
                                                <p className="text-sm font-semibold text-slate-900">{app.title || 'Unknown Application'}</p>
                                                <div className="flex items-center justify-between mt-2 gap-3">
                                                    <span className="inline-flex items-center rounded-full border border-orange-100 px-2.5 py-0.5 text-[10px] font-semibold bg-orange-50 text-orange-600">
                                                        {app.subtitle ? app.subtitle.replace('Plan: ', '') : 'Advanced Plan'}
                                                    </span>
                                                    <span className="text-sm font-bold text-orange-600">
                                                        {app.amount ? `$${Number(app.amount).toFixed(2)}` : getPlanPrice(app.title, app.subtitle)}
                                                    </span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="rounded-xl border border-slate-100 p-3 text-center">
                                                <p className="text-sm font-semibold text-slate-500">No applications yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-3xl bg-white border border-slate-200/70 p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                            <div className="pb-4 border-b border-slate-100">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Application Status</h3>
                                        <p className="text-sm font-medium text-slate-500 mt-1">{latestApplication?.title || 'Loading...'}</p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${latestStatusMeta.tone === 'success' ? 'bg-emerald-100 text-emerald-700' : latestStatusMeta.tone === 'danger' ? 'bg-rose-100 text-rose-700' : latestStatusMeta.tone === 'info' ? 'bg-sky-100 text-sky-700' : latestStatusMeta.tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {latestStatusMeta.label}
                                    </span>
                                </div>
                            </div>
                            <ol className="mt-6 relative">
                                <li className="relative pl-14 pb-6 last:pb-0">
                                    <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-sky-500" />
                                    <span className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white border-emerald-500 text-emerald-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                        </svg>
                                    </span>
                                    <div className="rounded-2xl px-4 py-3 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900">Intake</p>
                                            <p className="text-sm text-slate-500 mt-0.5">Intake completed</p>
                                        </div>
                                        <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Done</span>
                                    </div>
                                </li>
                                <li className="relative pl-14 pb-6 last:pb-0">
                                    <span className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? 'bg-sky-500' : 'bg-slate-200'}`} />
                                    <span className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? 'bg-white border-emerald-500 text-emerald-600' : 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/30'}`}>
                                        {['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v4m0 4h.01M4 20h16" />
                                            </svg>
                                        )}
                                    </span>
                                    <div className={`rounded-2xl px-4 py-3 flex items-start justify-between gap-3 ${['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? '' : 'bg-sky-50'}`}>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900">In Progress</p>
                                            <p className="text-sm text-slate-500 mt-0.5">You are completing your application</p>
                                        </div>
                                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-200 text-sky-800'}`}>
                                            {['submitted', 'completed', 'review'].includes(latestApplication?.status?.toLowerCase()) ? 'Done' : 'Current'}
                                        </span>
                                    </div>
                                </li>
                                <li className="relative pl-14 pb-6 last:pb-0">
                                    <span className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${['submitted', 'completed', 'review', 'in review', 'under review', 'approved', 'denied', 'rejected'].includes((latestApplication?.status || '').toString().trim().toLowerCase()) ? 'bg-sky-500 border-sky-500 text-white shadow-md shadow-sky-500/30' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                    <div className={`rounded-2xl px-4 py-3 flex items-start justify-between gap-3 ${['submitted', 'completed', 'review', 'in review', 'under review', 'approved', 'denied', 'rejected'].includes((latestApplication?.status || '').toString().trim().toLowerCase()) ? 'bg-sky-50' : ''}`}>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900">Submitted</p>
                                            <p className="text-sm text-slate-500 mt-0.5">Your application is submitted for review</p>
                                        </div>
                                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${['submitted', 'completed', 'review', 'in review', 'under review', 'approved', 'denied', 'rejected'].includes((latestApplication?.status || '').toString().trim().toLowerCase()) ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-500'}`}>
                                            {['submitted', 'completed', 'review', 'in review', 'under review', 'approved', 'denied', 'rejected'].includes((latestApplication?.status || '').toString().trim().toLowerCase()) ? 'Done' : 'Upcoming'}
                                        </span>
                                    </div>
                                </li>
                                <li className="relative pl-14 pb-6 last:pb-0">
                                    <span className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${latestStatusMeta.isDecision ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                    <span className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${latestStatusMeta.isDecision ? 'bg-white border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                    <div className={`rounded-2xl px-4 py-3 flex items-start justify-between gap-3 ${latestStatusMeta.isDecision ? 'bg-emerald-50' : ''}`}>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-900">Decision</p>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {latestStatusMeta.label === 'Approved'
                                                    ? 'Your application has been approved.'
                                                    : latestStatusMeta.label === 'Denied'
                                                        ? 'Your application was not approved.'
                                                        : 'Your final decision will appear here once the review is complete.'}
                                            </p>
                                        </div>
                                        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${latestStatusMeta.label === 'Approved' ? 'bg-emerald-100 text-emerald-700' : latestStatusMeta.label === 'Denied' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {latestStatusMeta.isDecision ? latestStatusMeta.label : 'Upcoming'}
                                        </span>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

            {!isParticipantOnly && (
                <div className="rounded-3xl bg-white border border-slate-200/70 p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Immigration Journey</h2>
                    
                    <div className="mt-6 border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Continue Your Immigration Journey with Horizon Pathways</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-3xl">
                            Whether you're ready to remove the conditions on your Green Card, apply for U.S. citizenship, renew your Green Card, or begin another immigration process, Horizon Pathways makes it easy to manage all your cases in one secure account. 
                            Continue your immigration journey by adding your next application directly from your dashboard.
                        </p>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Start Your Next Application
                        </button>
                    </div>
                </div>
            )}
            </div>

            <ApplicationSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            
            {latestApplication && ['i-130', 'i-129f', 'i-485', 'i-751'].includes(latestApplication.form_slug) && (
                <InviteParticipantModal 
                    isOpen={isInviteModalOpen} 
                    onClose={() => setIsInviteModalOpen(false)} 
                    applicationId={latestApplication.id}
                    applicationTitle={latestApplication.title}
                    applicationSlug={latestApplication.form_slug}
                />
            )}

            {showChatError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            backgroundColor: '#FEF3C7', color: '#D97706',
                            width: '64px', height: '64px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Case Manager Pending</h3>
                        <p style={{ color: '#6B7280', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            You cannot proceed yet because a case manager has not been assigned to your application. We are reviewing your application and will assign a manager shortly!
                        </p>
                        <button
                            onClick={() => setShowChatError(false)}
                            style={{
                                backgroundColor: '#1E40AF', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}

            {showWrongPackageError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            backgroundColor: '#FEE2E2', color: '#DC2626',
                            width: '64px', height: '64px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Action Required</h3>
                        <p style={{ color: '#6B7280', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            You have informed your Case Manager that you selected the wrong package. Please wait for them to update your account before proceeding with your application.
                        </p>
                        <button
                            onClick={() => setShowWrongPackageError(false)}
                            style={{
                                backgroundColor: '#1E40AF', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}

            {showPaymentError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(3px)'
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                        maxWidth: '420px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        textAlign: 'center', animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div style={{
                            backgroundColor: '#FEE2E2', color: '#DC2626',
                            width: '64px', height: '64px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px auto'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1.25rem', fontWeight: 600 }}>Payment Required</h3>
                        <p style={{ color: '#6B7280', margin: '0 0 24px 0', lineHeight: 1.5, fontSize: '0.95rem' }}>
                            Please complete your package payment before starting your application. Check the payment banner above for details.
                        </p>
                        <button
                            onClick={() => setShowPaymentError(false)}
                            style={{
                                backgroundColor: '#1E40AF', color: 'white', border: 'none',
                                borderRadius: '8px', padding: '12px 24px', fontWeight: 500,
                                cursor: 'pointer', width: '100%', fontSize: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E40AF'}
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
