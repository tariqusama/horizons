'use client';
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApplicationSelectionModal from "@/app/components/ApplicationSelectionModal";
import InviteParticipantModal from "@/components/InviteParticipantModal";

interface Application {
    id: number;
    title: string;
    subtitle: string;
    status: string;
    progress: string;
    next_step: string;
    created_at: string;
    form_slug?: string;
}

const getApplicationStatusMeta = (status?: string) => {
    const normalized = (status || '').toString().trim().toLowerCase();

    if (['approved', 'approved by admin', 'approved by uscis'].includes(normalized)) {
        return { label: 'Approved', tone: 'success', route: '/dashboard/case-status', buttonLabel: 'View Status' };
    }

    if (['denied', 'rejected', 'declined'].includes(normalized)) {
        return { label: 'Denied', tone: 'danger', route: '/dashboard/case-status', buttonLabel: 'View Status' };
    }

    if (['submitted', 'completed', 'review', 'in review', 'under review'].includes(normalized)) {
        return { label: 'In Review', tone: 'info', route: '/dashboard/get-started/preview', buttonLabel: 'View Application' };
    }

    if (['pending', 'in progress', 'active', 'processing'].includes(normalized)) {
        return { label: 'In Progress', tone: 'warning', route: '/dashboard/get-started', buttonLabel: 'Continue Application' };
    }

    return { label: status || 'Pending', tone: 'default', route: '/dashboard/get-started', buttonLabel: 'Continue Application' };
};

export default function DashboardApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedApplicationForInvite, setSelectedApplicationForInvite] = useState<Application | null>(null);
    const [showChatError, setShowChatError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                setApplications(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleStartApplication = (app: any) => {
        const statusMeta = getApplicationStatusMeta(app.status);
        router.push(statusMeta.route);
    };

    const getPlanDetails = (goal: string, subtitle: string) => {
        const isAdvanced = subtitle.toLowerCase().includes('advanced');
        const isPremium = subtitle.toLowerCase().includes('premium');

        let price = isPremium ? "$649.99" : isAdvanced ? "$449.99" : "$349.99";

        if (goal === "Replace or fix a Green Card") {
            price = isPremium ? "$599.99" : isAdvanced ? "$449.99" : "$349.99";
        } else if (goal.includes("fiancé(e) or spouse")) {
            price = isPremium ? "$999.99" : isAdvanced ? "$789.99" : "$549.99";
        } else if (goal.includes("Adjust status")) {
            price = isPremium ? "$1249.99" : isAdvanced ? "$949.99" : "$599.99";
        } else if (goal.includes("Remove conditions")) {
            price = isPremium ? "$699.99" : isAdvanced ? "$499.99" : "$399.99";
        } else if (goal.includes("DACA")) {
            price = isPremium ? "$539.99" : isAdvanced ? "$399.99" : "$299.99";
        } else if (goal.includes("Citizenship")) {
            price = isPremium ? "$649.99" : isAdvanced ? "$449.99" : "$349.99";
        }

        const bullets = isPremium
            ? ["Everything in Advanced Plan", "Attorney prep & signature", "24/7 dedicated support"]
            : isAdvanced
                ? ["Everything in Basic Plan", "Certified translation services", "Legal review by an immigration attorney"]
                : ["Step-by-step guidance", "Automatic form filling", "Error checking"];

        return { price, bullets };
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (isLoading) {
        return <div className="p-10 text-[#5A6579]">Loading applications...</div>;
    }

    return (
        <div className="w-full">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1B3A64]">My Applications</h1>
                    <p className="text-[15px] text-[#5A6579] mt-1">Track all your immigration applications</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center space-x-2 bg-[#FA6514] hover:bg-gradient-to-b from-orange-500 to-orange-600 text-white font-bold py-2.5 px-5 rounded-lg transition-colors">
                        <span className="text-lg leading-none">+</span>
                        <span>New Application</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {applications.length === 0 ? (
                    <div className="rounded-[12px] border border-gray-200 bg-white p-8 text-center text-[#5A6579]">
                        You don't have any active applications yet.
                    </div>
                ) : applications.map((app) => {
                    const { price, bullets } = getPlanDetails(app.title, app.subtitle);
                    const planName = app.subtitle.replace('Plan: ', '') + ' Plan';
                    const statusMeta = getApplicationStatusMeta(app.status);

                    return (
                        <div key={app.id} className="bg-white rounded-[12px] border border-gray-200 shadow-sm overflow-hidden">
                            {/* Top Header */}
                            <div className="p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex space-x-3 items-start">
                                    <div className="mt-1">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#FA6514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 2V8H20" stroke="#FA6514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 13H8" stroke="#FA6514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 17H8" stroke="#FA6514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 9H8" stroke="#FA6514" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-[18px] font-bold text-[#1B3A64] leading-tight">{app.title}</h2>
                                        <p className="text-[13px] text-[#5A6579] mt-1">Purchased on {formatDate(app.created_at)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                                    <span className="bg-[#FFF0E6] text-[#FA6514] text-[12px] font-bold px-3 py-1 rounded-full">
                                        {planName}
                                    </span>
                                    <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${statusMeta.tone === 'success' ? 'bg-emerald-100 text-emerald-700' : statusMeta.tone === 'danger' ? 'bg-rose-100 text-rose-700' : statusMeta.tone === 'info' ? 'bg-sky-100 text-sky-700' : statusMeta.tone === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-[#E6F0FF] text-[#1D4ED8]'}`}>
                                        {statusMeta.label}
                                    </span>
                                    <span className="bg-[#E6F0FF] text-[#1D4ED8] text-[12px] font-bold px-3 py-1 rounded-full">
                                        paid
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Plan Price */}
                            <div className="p-6 flex justify-between items-center">
                                <span className="text-[14px] text-[#5A6579]">Plan Price</span>
                                <span className="text-[20px] font-bold text-[#FA6514]">{price}</span>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Application Ready / Status */}
                            <div className="p-6">
                                <div className="flex items-start space-x-3">
                                    <div className="mt-0.5 bg-[#ECFDF5] rounded-lg p-1.5 flex items-center justify-center">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 11.08V12C21.9988 14.1564 21.3001 16.2547 20.0093 17.9818C18.7185 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98233 16.07 2.85999" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M22 4L12 14.01L9 11.01" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-[#1B3A64]">{statusMeta.label === 'Approved' ? 'Approved' : app.progress || 'Application Ready'}</h3>
                                        <p className="text-[14px] text-[#5A6579] mt-1">{statusMeta.label === 'Approved' ? 'Your application has been approved and the decision is now available.' : app.next_step || 'Your plan is ready for processing. Our team will contact you soon.'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* What's Included */}
                            <div className="p-6 bg-[#FAFAFB]">
                                <h4 className="text-[15px] font-bold text-[#1B3A64] mb-4">What's Included</h4>
                                <ul className="space-y-3">
                                    {bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <div className="mt-0.5">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <span className="text-[14px] text-[#5A6579]">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row justify-end gap-3">
                                    {['i-130', 'i-129f', 'i-485', 'i-751'].includes(app.form_slug || '') && statusMeta.label === 'In Progress' && (
                                        <button
                                            onClick={() => {
                                                setSelectedApplicationForInvite(app);
                                                setIsInviteModalOpen(true);
                                            }}
                                            className="bg-violet-50 text-violet-700 hover:bg-violet-100 font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                                            <span>Invite Participant</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleStartApplication(app)}
                                        className="bg-[#1B3A64] hover:bg-[#152e52] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center space-x-2 shadow-sm"
                                    >
                                        <span>
                                            {statusMeta.buttonLabel}
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <ApplicationSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {selectedApplicationForInvite && (
                <InviteParticipantModal
                    isOpen={isInviteModalOpen}
                    onClose={() => {
                        setIsInviteModalOpen(false);
                        setSelectedApplicationForInvite(null);
                    }}
                    applicationId={selectedApplicationForInvite.id}
                    applicationTitle={selectedApplicationForInvite.title}
                    applicationSlug={selectedApplicationForInvite.form_slug}
                />
            )}

            {showChatError && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
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
                            You cannot proceed yet because a case manager has not been assigned to this specific application. We are reviewing your application and will assign a manager shortly!
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
        </div>
    );
}
