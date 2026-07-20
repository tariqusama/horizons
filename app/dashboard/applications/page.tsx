'use client';
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApplicationSelectionModal from "@/app/components/ApplicationSelectionModal";

interface Application {
    id: number;
    title: string;
    subtitle: string;
    status: string;
    progress: string;
    next_step: string;
    created_at: string;
}

export default function DashboardApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        api.get('/applications')
            .then(res => {
                setApplications(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

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
        <div className="w-full max-w-5xl">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-[#1B3A64]">My Applications</h1>
                    <p className="text-[15px] text-[#5A6579] mt-1">Track all your immigration applications</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center space-x-2 bg-[#FA6514] hover:bg-[#E3755D] text-white font-bold py-2.5 px-5 rounded-lg transition-colors">
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
                                <div className="flex space-x-2 mt-4 sm:mt-0">
                                    <span className="bg-[#FFF0E6] text-[#FA6514] text-[12px] font-bold px-3 py-1 rounded-full">
                                        {planName}
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
                                        <h3 className="text-[16px] font-bold text-[#1B3A64]">Application Ready</h3>
                                        <p className="text-[14px] text-[#5A6579] mt-1">Your plan is ready for processing. Our team will contact you soon.</p>
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
                            </div>
                        </div>
                    );
                })}
            </div>

            <ApplicationSelectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
